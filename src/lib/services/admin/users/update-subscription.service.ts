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

  const startDate = updateDto.startDate ?? new Date();
  const initialAmount = Decimal(
    updateDto.amount ? updateDto.amount : (pricing?.price.toNumber() ?? 0),
  );
  const activeSubscription = await subscriptionRepo.getByUserIdAndIsActive(
    user.id,
    true,
  );

  await prisma.$transaction(async (tc) => {
    // Activate subscriptions
    if (activeSubscription == null && updateDto.isActive && pricing != null) {
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
          nextBillingDate: getNextBillingDate(
            startDate,
            toAppIntervalType(pricing.intervalType),
            pricing.intervalCount,
          ),
          status: "WillRenew",
          initialAmount,
          paymentGateway: "Manual",
          reference: await sharedSubscriptionService.generateReference(tc),
        },
        tc,
      );

      const userSettings = pricingSettings
        ? pricingSettingsService.topUpCredits(pricingSettings, user)
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

        const freePricing = await pricingRepo.getByIsFree(tc);
        let freePricingSettings: PricingSetting | null = null;
        if (freePricing) {
          freePricingSettings = await pricingSettingRepo.getByPricingId(
            freePricing.id,
            tc,
          );
        }

        const userSettings = freePricingSettings
          ? pricingSettingsService.topUpCredits(freePricingSettings, user)
          : {};
        await userRepo.update(
          user.id,
          {
            ...userSettings,
            hasActiveSubscription: false,
          },
          tc,
        );
      }
      // Changing plans
      else if (pricing != null) {
        await subscriptionRepo.update(
          activeSubscription.id,
          {
            planId: pricing.planId,
            planName: pricing.planName,
            pricingId: pricing.id,
            pricingName: pricing.name,
            startDate,
            nextBillingDate: getNextBillingDate(
              startDate,
              toAppIntervalType(pricing.intervalType),
              pricing.intervalCount,
            ),
            initialAmount,
          },
          tc,
        );

        const userSettings = pricingSettings
          ? pricingSettingsService.topUpCredits(pricingSettings, user)
          : {};
        await userRepo.update(
          user.id,
          {
            ...userSettings,
            hasActiveSubscription: true,
          },
          tc,
        );
      }
    }
  });
};
