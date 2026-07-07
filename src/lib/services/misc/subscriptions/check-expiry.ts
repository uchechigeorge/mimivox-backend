import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";

export const checkExpiry = async () => {
  const subscriptions = await subscriptionRepo.listByExpiredAndIsActive();

  const subscriptionIds = subscriptions.map((subscription) => subscription.id);

  for (const subscription of subscriptions) {
    await subscriptionRepo.update(subscription.id, {
      isActive: true,
      status: "Cancelled",
    });
    const user = await userRepo.getById(subscription.userId);
    if (user) {
      await userRepo.update(user.id, {
        hasActiveSubscription: false,
      });
    }
  }

  return { subscriptionIds };
};
