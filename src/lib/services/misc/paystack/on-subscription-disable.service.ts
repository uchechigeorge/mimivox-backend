import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackCustomerRepo from "@/lib/repositories/paystack-customer.repo";
import userRepo from "@/lib/repositories/user.repo";
import paystackPlanRepo from "@/lib/repositories/paystack-pricing.repo";
import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";

export const onSubscriptionDisable = async (body: HandlePaystackWebhookDto) => {
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

  await userRepo.update(subscription.id, {
    hasActiveSubscription: false,
  });

  await subscriptionRepo.update(subscription.id, {
    isActive: false,
    status: "Cancelled",
  });
};
