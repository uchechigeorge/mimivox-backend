import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackCustomerRepo from "@/lib/repositories/paystack-customer.repo";
import userRepo from "@/lib/repositories/user.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";
import { sendSubscriptionPaymentFailed } from "../../user/notifications/subscription-payment-failed.service";

export const onInvoicePaymentFailed = async (
  body: HandlePaystackWebhookDto,
) => {
  const data = body.data;

  if (
    !data.subscription ||
    !data.subscription.subscription_code ||
    !data.customer ||
    !data.customer.customer_code
  ) {
    console.error(
      `Paystack webhook error: Missing customer or subscription data; ${JSON.stringify(
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
    data.subscription.subscription_code,
  );
  if (!paystackSubscription || !paystackSubscription.subscriptionId) {
    console.error(
      `Paystack webhook error: Paystack subscription not found; ${JSON.stringify(
        {
          plan: data.plan,
        },
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

  if (data.subscription.status === "attention") {
    await subscriptionRepo.update(subscription.id, {
      status: "PastDue",
      endDate: subscription.nextBillingDate,
    });
  }

  await sendSubscriptionPaymentFailed(user.email, {
    userName: user.fullName,
    amount: data.amount ? data.amount / 100 : 0,
    planName: subscription.planName,
    retryDate: null,
  });
};
