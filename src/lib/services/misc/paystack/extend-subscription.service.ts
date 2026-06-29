import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackCustomerRepo from "@/lib/repositories/paystack-customer.repo";
import paystackPlanRepo from "@/lib/repositories/paystack-pricing.repo";
import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import { getNextBillingDate } from "@/lib/utils/date.utils";
import { toAppIntervalType } from "../../shared/pricings/pricing-helper.service";
import { prisma } from "@/lib/db/prisma";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import planSettingRepo from "@/lib/repositories/plan-setting.repo";
import { getUserSettings } from "./handle-subscription-payment.service";

export const extendSubscription = async (body: HandlePaystackWebhookDto) => {
  const data = body.data;

  if (
    !data.customer ||
    !data.customer.customer_code ||
    !data.plan ||
    !data.plan.plan_code
  ) {
    console.error(
      `Paystack webhook error: Missing customer or plan data; ${JSON.stringify({
        data,
      })}`,
    );
    return;
  }

  const paystackUser = await paystackCustomerRepo.getByReference(
    data.customer.customer_code,
  );
  if (!paystackUser || !paystackUser.userId) {
    console.error(
      `Paystack webhook error: Could not find paystack customer; ${JSON.stringify(
        {
          customer: data.customer,
        },
      )}`,
    );
    return;
  }

  const user = await userRepo.getById(paystackUser.userId);
  if (!user) {
    console.error(
      `Paystack webhook error: User not found for paystack customer; ${JSON.stringify(
        { paystackUser },
      )}`,
    );
    return;
  }

  const paystackPlan = await paystackPlanRepo.getByReference(
    data.plan.plan_code,
  );
  if (!paystackPlan || !paystackPlan.pricingId) {
    console.error(
      `Paystack webhook error: Paystack plan not found; ${JSON.stringify({
        plan: data.plan,
      })}`,
    );
    return;
  }

  const pricing = await pricingRepo.getById(paystackPlan.pricingId);
  if (!pricing) {
    console.error(
      `Paystack webhook error: Pricing not found for paystack plan; ${JSON.stringify(
        { paystackPlan },
      )}`,
    );
    return;
  }

  const subscription = await subscriptionRepo.getByUserIdAndIsActive(
    user.id,
    true,
  );
  if (!subscription) {
    console.error(
      `Paystack webhook error: No active subscriptions found; ${JSON.stringify({
        subscription,
      })}`,
    );
    return;
  }

  if (subscription.pricingId != pricing.id) {
    console.error(
      `Paystack webhook error: Active subscription pricing not equal to paystack plan pricing; ${JSON.stringify(
        { paystackPlan, subscription },
      )}`,
    );
    return;
  }

  const amountPaid = Number(data.amount ? data.amount / 100 : 0);
  const currency = data.currency?.toLowerCase() ?? null;

  // const currencyOption = await currencyRepo.getByCode(currency ?? "");
  // Default naira to dollar exchange rate if currency not found
  // const exchangeRateToBase = currencyOption?.exchangeRateToBase ?? 1500;

  const nextBillingDate = getNextBillingDate(
    subscription.nextBillingDate ?? new Date(),
    toAppIntervalType(pricing.intervalType),
    pricing.intervalCount,
  );

  console.error({ nextBillingDate });

  await prisma.$transaction(async (tx) => {
    const planSettings = await planSettingRepo.getByPlanId(pricing.planId, tx);
    const userSettings = getUserSettings(planSettings);
    await userRepo.update(
      user.id,
      {
        ...userSettings,
        hasActiveSubscription: true,
      },
      tx,
    );

    await subscriptionRepo.update(
      subscription.id,
      {
        isActive: true,
        paymentVerified: true,
        status: "WillRenew",
        nextBillingDate,
      },
      tx,
    );

    await subscriptionPaymentRepo.create(
      {
        amount: amountPaid,
        subscriptionReference: subscription.reference,
        paymentGateway: "Paystack",
        isInitialPayment: true,
        isPaymentVerified: true,
        paidAt: new Date(),
        subscriptionId: subscription.id,
        currency,
        userId: user.id,
        userName: user.fullName,
      },
      tx,
    );
  });
};
