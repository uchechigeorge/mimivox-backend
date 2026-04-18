import { SubscriptionExtendParams } from "@/lib/dtos/admin/subscription.dto";
import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { getNextBillingDate } from "@/lib/utils/date.utils";
import { BadRequestError } from "@/lib/utils/error.util";
import { toAppIntervalType } from "../../shared/pricings/pricing-helper.service";
import { SubscriptionPaymentCreateArgs } from "@/generated/prisma/models";
import { prisma } from "@/lib/db/prisma";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";

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

  if (subscription.nextBillingDate != null)
    subscription.nextBillingDate = getNextBillingDate(
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
  };

  await prisma.$transaction(async (tc) => {
    await subscriptionRepo.update(
      subscription.id,
      {
        isActive: true,
        status: "WillRenew",
        nextBillingDate: subscription.nextBillingDate,
      },
      tc,
    );

    await subscriptionPaymentRepo.create(subscriptionPayment, tc);
  });
};
