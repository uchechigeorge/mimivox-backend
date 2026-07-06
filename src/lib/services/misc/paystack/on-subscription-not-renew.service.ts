import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackCustomerRepo from "@/lib/repositories/paystack-customer.repo";
import userRepo from "@/lib/repositories/user.repo";
import { sendSubscriptionCancelled } from "../../user/notifications/subscription-cancel.service";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";

export const onSubscriptionNotRenew = async (
  body: HandlePaystackWebhookDto,
) => {
  const data = body.data;

  if (
    !data.customer ||
    !data.customer.customer_code ||
    !data.plan ||
    !data.plan.plan_code ||
    !data.subscription_code
  ) {
    console.error(
      `Paystack webhook error: Missing customer or plan/subscription data; ${JSON.stringify(
        {
          data,
        },
      )}`,
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

  const paystackSubscription = await paystackSubscriptionRepo.getByReference(
    data.subscription_code,
  );
  if (!paystackSubscription || !paystackSubscription.subscriptionId) {
    console.error(
      `Paystack webhook error: Paystack subscription not found; ${JSON.stringify(
        {
          subscription: data.subscription_code,
        },
      )}`,
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
      })}`,
    );
    return;
  }

  await subscriptionRepo.update(subscription.id, {
    status: "NonRenewing",
    endDate: subscription.nextBillingDate,
  });

  const isChangingPlan =
    await subscriptionRepo.getExistsByPreviousSubscriptionId(subscription.id);

  if (isChangingPlan) return;

  await sendSubscriptionCancelled(user.email, {
    userName: user.fullName,
    expirationDate: subscription.endDate,
    planName: subscription.planName,
  });
};
