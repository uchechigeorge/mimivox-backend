import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import paystackSubscriptionService from "../../shared/paystack/subscriptions";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";
import paystackService from "../../shared/paystack";
import { BadRequestError } from "@/lib/utils/error.util";

export const checkExpiry = async () => {
  const subscriptions = await subscriptionRepo.listByExpiredAndIsActive();

  const subscriptionIds = subscriptions.map((subscription) => subscription.id);

  for (const subscription of subscriptions) {
    await subscriptionRepo.update(subscription.id, {
      isActive: false,
      status: "Cancelled",
    });
    const user = await userRepo.getById(subscription.userId);
    if (user) {
      await userRepo.update(user.id, {
        hasActiveSubscription: false,
      });
    }

    if (subscription.paymentGateway === "Paystack") {
      const paystackSubscriptionRef =
        await paystackSubscriptionRepo.getBySubscriptionId(subscription.id);
      if (!paystackSubscriptionRef) continue;

      const [paystackRes, paystackFetchErr] =
        await paystackService.subscription.fetchSubscription(
          paystackSubscriptionRef.reference,
        );
      if (paystackFetchErr)
        throw new BadRequestError("Paystack subscription not found");
      await paystackSubscriptionService.disableSubscription({
        code: paystackRes.subscription_code,
        token: paystackRes.email_token,
      });
    }
  }

  return { subscriptionIds };
};
