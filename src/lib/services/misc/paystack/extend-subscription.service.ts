import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackCustomerRepo from "@/lib/repositories/paystack-customer.repo";
import paystackPlanRepo from "@/lib/repositories/paystack-pricing.repo";
import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import { getNextBillingDate } from "@/lib/utils/date.utils";
import { toAppIntervalType } from "../../shared/pricings/pricing-helper.service";
import { prisma } from "@/lib/db/prisma";
import pricingSettingRepo from "@/lib/repositories/pricing-setting.repo";
import pricingSettingsService from "../../shared/pricing-settings";

export const extendSubscription = async (body: HandlePaystackWebhookDto) => {
  const data = body.data;

  if (
    !data.customer ||
    !data.customer.customer_code ||
    !data.plan ||
    !data.plan.plan_code ||
    !data.subscription_code
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
      })} [charge.success]`,
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

  const nextBillingDate = getNextBillingDate(
    subscription.nextBillingDate ?? new Date(),
    toAppIntervalType(pricing.intervalType),
    pricing.intervalCount,
  );

  await prisma.$transaction(async (tx) => {
    const pricingSettings = await pricingSettingRepo.getByPricingId(
      pricing.id,
      tx,
    );
    const userSettings = pricingSettings
      ? pricingSettingsService.topUpCredits(pricingSettings, user)
      : {};

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

    await userRepo.update(
      user.id,
      {
        ...userSettings,
        hasActiveSubscription: true,
      },
      tx,
    );
  });
};
