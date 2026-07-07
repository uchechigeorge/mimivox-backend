import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackCustomerRepo from "@/lib/repositories/paystack-customer.repo";
import userRepo from "@/lib/repositories/user.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";

export const onSubscriptionDisable = async (body: HandlePaystackWebhookDto) => {
  const data = body.data;

  if (
    !data.customer ||
    !data.customer.customer_code ||
    !data.plan ||
    !data.plan.plan_code ||
    !data.subscription_code
  ) {
    console.error(
      `Paystack webhook error: Missing customer or subscription/plan data; ${JSON.stringify(
        {
          data,
        },
      )} [subscription.disable]`,
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
      )} [subscription.disable]`,
    );
    return;
  }

  const user = await userRepo.getById(paystackUser.userId);
  if (!user) {
    console.error(
      `Paystack webhook error: User not found for paystack customer; ${JSON.stringify(
        { paystackUser },
      )} [subscription.disable]`,
    );
    return;
  }

  const paystackSubscription = await paystackSubscriptionRepo.getByReference(
    data.subscription_code,
  );
  if (!paystackSubscription || !paystackSubscription.subscriptionId) {
    console.error(
      `Paystack webhook error: Paystack subscription not found; ${JSON.stringify(
        {
          subscription: data.subscription_code,
        },
      )} [subscription.disable]`,
    );
    return;
  }

  const subscription = await subscriptionRepo.getById(
    paystackSubscription.subscriptionId,
  );
  if (!subscription) {
    console.error(
      `Paystack webhook error: Subscription not found; ${JSON.stringify({
        subscription,
      })} [subscription.disable]`,
    );
    return;
  }

  const previousSubscription = await subscriptionRepo.getById(subscription.id);
  if (!previousSubscription) {
    await userRepo.update(user.id, {
      hasActiveSubscription: false,
    });
  }

  await subscriptionRepo.update(subscription.id, {
    isActive: false,
    status: "Cancelled",
  });
};
