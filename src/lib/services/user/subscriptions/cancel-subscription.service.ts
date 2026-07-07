import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import paystackService from "../../shared/paystack";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";
import { PaystackSubscription } from "../../shared/paystack/subscriptions/types";

export const cancelSubscription = async (authItems: UserAuthItems) => {
  const userId = authItems.userId;
  if (!userId) {
    throw new UnauthorizedError();
  }
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  const activeSubscription = await subscriptionRepo.getByUserIdAndIsActive(
    userId,
    true,
  );
  if (!activeSubscription) {
    throw new BadRequestError("User does not have an active subscription");
  }

  let paystackSubscription: PaystackSubscription | null = null;
  if (activeSubscription.paymentGateway == "Paystack") {
    const paystackSubscriptionRef =
      await paystackSubscriptionRepo.getBySubscriptionId(activeSubscription.id);
    if (!paystackSubscriptionRef)
      throw new BadRequestError("Paystack subscription not found");

    const [paystackRes, paystackFetchErr] =
      await paystackService.subscription.fetchSubscription(
        paystackSubscriptionRef.reference,
      );
    if (paystackFetchErr)
      throw new BadRequestError("Paystack subscription not found");
    paystackSubscription = paystackRes;
  }

  const isExpired =
    activeSubscription.status === "PastDue" ||
    (activeSubscription.nextBillingDate != null &&
      activeSubscription.nextBillingDate < new Date());

  await subscriptionRepo.update(activeSubscription.id, {
    status: isExpired ? "Cancelled" : "NonRenewing",
    endDate: activeSubscription.nextBillingDate,
    isActive: isExpired,
  });

  if (isExpired) {
    await userRepo.update(userId, {
      hasActiveSubscription: false,
    });
  }

  if (activeSubscription.paymentGateway == "Paystack" && paystackSubscription) {
    await paystackService.subscription.disableSubscription({
      code: paystackSubscription.subscription_code,
      token: paystackSubscription.email_token,
    });
  }
};
