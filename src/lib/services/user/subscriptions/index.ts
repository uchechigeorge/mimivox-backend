import { createSubscription } from "./create-subscription.service";
import { getSubscriptionByPaymentToken } from "./get-subscription-by-payment-token.service";

const subscriptionService = {
  createSubscription,
  getSubscriptionByPaymentToken,
};

export default subscriptionService;
