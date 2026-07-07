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

export const extendSubscription = async (params: SubscriptionExtendParams) => {
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

  const user = await userRepo.getById(subscription.userId);
  if (!user) throw new BadRequestError("User not found");

  const nextBillingDate =
    subscription.nextBillingDate &&
    getNextBillingDate(
      subscription.nextBillingDate,
      toAppIntervalType(pricing.intervalType),
      pricing.intervalCount,
    );

  const subscriptionPayment: SubscriptionPaymentCreateArgs["data"] = {
    subscriptionId: subscription.id,
    subscriptionReference: subscription.reference,
    amount: pricing.price,
    paymentGateway: "Manual",
    isInitialPayment: false,
    isPaymentVerified: true,
    paidAt: new Date(),
    startDate: subscription.nextBillingDate,
    endDate: nextBillingDate,
    planId: subscription.planId,
    planName: subscription.planName,
    userId: subscription.userId,
    userName: user.fullName,
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

    await subscriptionPaymentRepo.create(subscriptionPayment, tc);
  });
};
