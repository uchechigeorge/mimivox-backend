import { extendSubscription } from "./extend-subscription.service";
import { getSubscription } from "./get-subscription.service";
import { listSubscriptions } from "./list-subscriptions.service";

const subscriptionService = {
  listSubscriptions,
  getSubscription,
  extendSubscription,
};

export default subscriptionService;
