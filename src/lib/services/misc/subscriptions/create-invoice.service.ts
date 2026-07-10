import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { getInvoiceLeadTime, getNextBillingDate } from "@/lib/utils/date.utils";
import { toAppIntervalType } from "../../shared/pricings/pricing-helper.service";
import { prisma } from "@/lib/db/prisma";

export const createInvoice = async () => {
  const subscriptions = await subscriptionRepo.listByIsActive();

  const subscriptionIds = subscriptions.map((subscription) => subscription.id);
  const subscriptionPaymentIds: string[] = [];

  for (const subscription of subscriptions) {
    if (!subscription.nextBillingDate) continue;

    const nextBillingDate = subscription.nextBillingDate;
    const currentInvoice =
      await subscriptionPaymentRepo.getByIsCurrentAndPending(subscription.id);

    if (currentInvoice) continue;

    const pricing = await pricingRepo.getById(subscription.pricingId);
    if (!pricing) continue;

    const intervalType = toAppIntervalType(pricing.intervalType);
    const intervalCount = pricing.intervalCount;

    const leadTime = getInvoiceLeadTime(intervalType, intervalCount);

    const invoiceDate = new Date(
      subscription.nextBillingDate.getTime() - leadTime,
    );
    const now = new Date();

    if (now >= invoiceDate && now < subscription.nextBillingDate) {
      await prisma.$transaction(async (tc) => {
        await subscriptionPaymentRepo.updateBySubscriptionId(
          subscription.id,
          {
            isCurrent: false,
          },
          tc,
        );

        const subscriptionPayment = await subscriptionPaymentRepo.create(
          {
            amount: subscription.initialAmount
              ? subscription.initialAmount.toNumber()
              : pricing.price.toNumber(),
            subscriptionReference: subscription.reference,
            paymentGateway: "Paystack",
            isInitialPayment: false,
            isPaymentVerified: false,
            subscriptionId: subscription.id,
            userId: subscription.id,
            userName: subscription.userName,
            planId: subscription.planId,
            planName: subscription.planName,
            startDate: subscription.nextBillingDate,
            endDate: getNextBillingDate(
              nextBillingDate,
              intervalType,
              intervalCount,
            ),
            isCurrent: true,
          },
          tc,
        );

        subscriptionPaymentIds.push(subscriptionPayment.id);
      });
    }
  }

  return { subscriptionIds, subscriptionPaymentIds };
};
