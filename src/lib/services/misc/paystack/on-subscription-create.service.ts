import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { BadRequestError } from "@/lib/utils/error.util";
import notificationService from "../../user/notifications";
import userRepo from "@/lib/repositories/user.repo";

export const onSubscriptionCreate = async (body: HandlePaystackWebhookDto) => {
  // Logic for handling subscription creation
  const data = body.data;

  // Validate subscription code
  if (!data.subscription_code) {
    console.error(
      `Paystack webhook error: Missing subscription code in subscription creation data; ${JSON.stringify(
        { data },
      )}`,
    );
    return;
  }

  // Get paystack subscription by subscription code
  const paystackSubscription = await paystackSubscriptionRepo.getByReference(
    data.subscription_code,
  );
  if (!paystackSubscription || !paystackSubscription.subscriptionId) {
    console.error(
      `Paystack webhook error: Paystack subscription not found; ${JSON.stringify(
        { subscriptionCode: data.subscription_code },
      )}`,
    );
    throw new BadRequestError("Paystack subscription not found");
  }

  // Get associated subscription
  const subscription = await subscriptionRepo.getById(
    paystackSubscription.subscriptionId,
  );
  if (!subscription) {
    console.error(
      `Paystack webhook error: Subscription not found for paystack subscription; ${JSON.stringify(
        { paystackSubscription },
      )}`,
    );
    return;
  }

  const user = await userRepo.getById(subscription.userId);
  if (!user) {
    console.error(
      `Paystack webhook error: User not found for subscription; ${JSON.stringify(
        { subscription },
      )}`,
    );
    return;
  }

  // Send notification
  await notificationService.sendSubscriptionActivated(user.email, {
    userName: user.firstName,
    planName: subscription.planName,
  });
};
