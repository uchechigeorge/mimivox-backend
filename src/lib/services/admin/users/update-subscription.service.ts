import { Pricing, PricingSetting } from "@/generated/prisma/client";
import {
  UpdateUserSubscriptionDto,
  UpdateUserSubscriptionParams,
} from "@/lib/dtos/admin/user.dto";
import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import { getNextBillingDate } from "@/lib/utils/date.utils";
import { BadRequestError } from "@/lib/utils/error.util";
import { toAppIntervalType } from "../../shared/pricings/pricing-helper.service";
import { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "@/lib/db/prisma";
import sharedSubscriptionService from "../../shared/subscriptions";
import pricingSettingsService from "../../shared/pricing-settings";
import pricingSettingRepo from "@/lib/repositories/pricing-setting.repo";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";
import paystackService from "../../shared/paystack";

export const updateUserSubscription = async (
  params: UpdateUserSubscriptionParams,
  updateDto: UpdateUserSubscriptionDto,
) => {
  const user = await userRepo.getById(params.id);
  if (!user) {
    throw new BadRequestError("User not found");
  }

  let pricing: Pricing | null = null;
  let pricingSettings: PricingSetting | null = null;

  if (updateDto.pricingId) {
    pricing = await pricingRepo.getById(updateDto.pricingId);
    if (!pricing) {
      throw new BadRequestError("Pricing not found");
    }

    pricingSettings = await pricingSettingRepo.getByPricingId(pricing.id);
    if (!pricingSettings) {
      throw new BadRequestError("Plan settings not found");
    }
  }

  if (updateDto.isActive && pricing == null) {
    throw new BadRequestError(
      "Pricing plan must be provided for active subscriptions",
    );
  }

  const activeSubscription = await subscriptionRepo.getByUserIdAndIsActive(
    user.id,
    true,
  );
  if (activeSubscription && pricing) {
    if (pricing.id == activeSubscription.pricingId) {
      throw new BadRequestError(
        "Already on subscription with existing pricing",
      );
    }
  }

  const startDate = updateDto.startDate ?? new Date();
  const initialAmount = Decimal(
    updateDto.amount ?? pricing?.price.toNumber() ?? 0,
  );
  const changeDate = new Date();
  const previousPaystackSubscription =
    activeSubscription?.paymentGateway === "Paystack"
      ? await paystackSubscriptionRepo.getBySubscriptionId(activeSubscription.id)
      : null;

  if (
    activeSubscription?.paymentGateway === "Paystack" &&
    !previousPaystackSubscription
  ) {
    throw new BadRequestError("Paystack subscription not found");
  }

  await prisma.$transaction(async (tc) => {
    // Activate subscriptions
    if (activeSubscription == null && updateDto.isActive && pricing != null) {
      const nextBillingDate = getNextBillingDate(
        startDate,
        toAppIntervalType(pricing.intervalType),
        pricing.intervalCount,
      );
      await subscriptionRepo.create(
        {
          isActive: true,
          userId: user.id,
          userName: user.fullName,
          planId: pricing.planId,
          planName: pricing.planName,
          pricingId: pricing.id,
          pricingName: pricing.name,
          startDate,
          nextBillingDate,
          status: "WillRenew",
          initialAmount,
          paymentGateway: "Manual",
          reference: await sharedSubscriptionService.generateReference(tc),
        },
        tc,
      );

      await userRepo.update(
        user.id,
        {
          nextBillingDate,
        },
        tc,
      );

      const currentUser = await userRepo.getByIdWithLock(user.id, tc);
      if (!currentUser) {
        throw new BadRequestError("User not found");
      }
      const userSettings = pricingSettings
        ? pricingSettingsService.topUpCredits(pricingSettings, currentUser)
        : {};
      await userRepo.update(
        user.id,
        {
          ...userSettings,
          hasActiveSubscription: true,
        },
        tc,
      );
    } else if (activeSubscription != null) {
      // Cancelling subscriptions
      if (updateDto.isActive == false) {
        await subscriptionRepo.update(
          activeSubscription.id,
          {
            isActive: false,
            status: "Completed",
            endDate: new Date(),
          },
          tc,
        );

        await subscriptionPaymentRepo.updateBySubscriptionId(
          activeSubscription.id,
          {
            isCurrent: false,
          },
          tc,
        );

        const freePricing = await pricingRepo.getByIsFree(tc);
        let freePricingSettings: PricingSetting | null = null;
        if (freePricing) {
          freePricingSettings = await pricingSettingRepo.getByPricingId(
            freePricing.id,
            tc,
          );
        }

        const currentUser = await userRepo.getByIdWithLock(user.id, tc);
        if (!currentUser) {
          throw new BadRequestError("User not found");
        }
        const userSettings = freePricingSettings
          ? pricingSettingsService.topUpCredits(freePricingSettings, currentUser)
          : {};
        await userRepo.update(
          user.id,
          {
            ...userSettings,
            hasActiveSubscription: false,
            nextBillingDate: null,
          },
          tc,
        );
      }
      // Changing plans
      else if (pricing != null) {
        const completed = await subscriptionRepo.completeActive(
          activeSubscription.id,
          changeDate,
          tc,
        );
        if (completed.count !== 1) {
          throw new BadRequestError(
            "Active subscription changed before the plan update completed",
          );
        }

        await subscriptionPaymentRepo.updateBySubscriptionId(
          activeSubscription.id,
          {
            isCurrent: false,
          },
          tc,
        );

        const newSubscription = await subscriptionRepo.create(
          {
            userId: user.id,
            userName: user.fullName,
            planId: pricing.planId,
            planName: pricing.planName,
            pricingId: pricing.id,
            pricingName: pricing.name,
            startDate: activeSubscription.startDate,
            nextBillingDate: activeSubscription.nextBillingDate,
            status: "WillRenew",
            isActive: true,
            initialAmount,
            paymentGateway: "Manual",
            previousSubscriptionId: activeSubscription.id,
            reference: await sharedSubscriptionService.generateReference(tc),
          },
          tc,
        );

        await subscriptionPaymentRepo.create(
          {
            subscriptionId: newSubscription.id,
            subscriptionReference: newSubscription.reference,
            amount: initialAmount,
            paymentGateway: "Manual",
            isInitialPayment: true,
            isPaymentVerified: true,
            isCurrent: true,
            status: "Paid",
            paidAt: changeDate,
            startDate: activeSubscription.startDate,
            endDate: activeSubscription.nextBillingDate,
            planId: pricing.planId,
            planName: pricing.planName,
            userId: user.id,
            userName: user.fullName,
          },
          tc,
        );

        const currentUser = await userRepo.getByIdWithLock(user.id, tc);
        if (!currentUser) {
          throw new BadRequestError("User not found");
        }
        const userSettings = pricingSettings
          ? pricingSettingsService.topUpCredits(pricingSettings, currentUser)
          : {};
        await userRepo.update(
          user.id,
          {
            ...userSettings,
            nextBillingDate: activeSubscription.nextBillingDate,
            hasActiveSubscription: true,
          },
          tc,
        );
      }
    }
  });

  if (previousPaystackSubscription) {
    await paystackService.subscription.disableSubscription({
      code: previousPaystackSubscription.reference,
      token: previousPaystackSubscription.token,
    });
  }
};
