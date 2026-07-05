import { cancelSubscription } from "./cancel-subscription.service";
import { changePlan } from "./change-plan.subscription.service";
import { createSubscription } from "./create-subscription.service";
import { getSubscriptionByPaymentToken } from "./get-subscription-by-payment-token.service";

const subscriptionService = {
  createSubscription,
  getSubscriptionByPaymentToken,
  changePlan,
  cancelSubscription,
};

export default subscriptionService;
