import { SubscriptionExtendParams } from "@/lib/dtos/admin/subscription.dto";
import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { getNextBillingDate } from "@/lib/utils/date.utils";
import { BadRequestError } from "@/lib/utils/error.util";
import { toAppIntervalType } from "../../shared/pricings/pricing-helper.service";
import { SubscriptionPaymentCreateArgs } from "@/generated/prisma/models";
import { prisma } from "@/lib/db/prisma";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import userRepo from "@/lib/repositories/user.repo";
import adminActionLogRepo from "@/lib/repositories/admin-action-log.repo";
import pricingSettingRepo from "@/lib/repositories/pricing-setting.repo";
import pricingSettingsService from "../../shared/pricing-settings";
import { AdminAuthItems } from "@/lib/types";

export const extendSubscription = async (
  params: SubscriptionExtendParams,
  authItems?: AdminAuthItems,
) => {
  const subscriptionId = params.id;
  const subscription = await subscriptionRepo.getById(subscriptionId);
  if (!subscription) throw new BadRequestError("Subscription not found");

  const pricing = await pricingRepo.getById(subscription.pricingId);
  if (!pricing) throw new BadRequestError("Pricing not found");

  if (!subscription.isActive) {
    throw new BadRequestError("Only active subscriptions can be extended");
  }

  if (
    subscription.isActive &&
    subscription.nextBillingDate != null &&
    subscription.nextBillingDate >= new Date()
  ) {
    throw new BadRequestError("Only expired subscriptions can be extended");
  }

  // Paystack renews its own subscriptions; extending one by hand would double up
  if (subscription.paymentGateway === "Paystack") {
    throw new BadRequestError(
      "Paystack subscriptions renew automatically and cannot be extended manually",
    );
  }

  const user = await userRepo.getById(subscription.userId);
  if (!user) throw new BadRequestError("User not found");

  // The subscription has already expired, so the new period starts now
  const periodStart = new Date();
  const nextBillingDate = getNextBillingDate(
    periodStart,
    toAppIntervalType(pricing.intervalType),
    pricing.intervalCount,
  );

  const subscriptionPayment: SubscriptionPaymentCreateArgs["data"] = {
    subscriptionId: subscription.id,
    subscriptionReference: subscription.reference,
    amount: pricing.price,
    paymentGateway: "Manual",
    adminId: authItems?.adminId,
    adminName: authItems?.adminName,
    isInitialPayment: false,
    isPaymentVerified: true,
    isCurrent: true,
    paidAt: new Date(),
    startDate: periodStart,
    endDate: nextBillingDate,
    planId: subscription.planId,
    planName: subscription.planName,
    userId: subscription.userId,
    userName: user.fullName,
    status: "Paid",
  };

  await prisma.$transaction(async (tc) => {
    await subscriptionRepo.update(
      subscription.id,
      {
        isActive: true,
        status: "WillRenew",
        nextBillingDate,
      },
      tc,
    );

    // A new period brings the plan's allowance, like a paid renewal
    const currentUser = await userRepo.getByIdWithLock(user.id, tc);
    if (!currentUser) throw new BadRequestError("User not found");
    const pricingSettings = await pricingSettingRepo.getByPricingId(
      pricing.id,
      tc,
    );
    const userSettings = pricingSettings
      ? pricingSettingsService.topUpCredits(pricingSettings, currentUser)
      : {};

    await userRepo.update(
      user.id,
      {
        ...userSettings,
        nextBillingDate,
        hasActiveSubscription: true,
      },
      tc,
    );

    await subscriptionPaymentRepo.updateBySubscriptionId(
      subscription.id,
      { isCurrent: false },
      tc,
    );
    await subscriptionPaymentRepo.create(subscriptionPayment, tc);

    await adminActionLogRepo.create(
      {
        adminId: authItems?.adminId,
        adminName: authItems?.adminName,
        userId: user.id,
        userName: user.fullName,
        action: "SubscriptionExtended",
        description: `Extended ${subscription.planName} - ${subscription.pricingName} manually`,
        amount: pricing.price,
      },
      tc,
    );
  });
};
