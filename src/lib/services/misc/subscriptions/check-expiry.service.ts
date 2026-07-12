import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import paystackSubscriptionService from "../../shared/paystack/subscriptions";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";

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
      const paystackSubscription =
        await paystackSubscriptionRepo.getBySubscriptionId(subscription.id);
      if (!paystackSubscription) continue;

      await paystackSubscriptionService.disableSubscription({
        code: paystackSubscription.reference,
        token: paystackSubscription.token,
      });
    }
  }

  return { subscriptionIds };
};
