import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import { handleSubscriptionPayment } from "./handle-subscription-payment.service";
import { extendSubscription } from "./extend-subscription.service";

export const onChargeSuccess = async (body: HandlePaystackWebhookDto) => {
  if (body.data.metadata?.type === "SubscriptionPayment") {
    await handleSubscriptionPayment(body);
  } else if (body.data.metadata?.type === "OneTimePayment") {
    // await handleOneTimePayment(body);
  } else if (body.data.plan && body.data.plan.plan_code) {
    await extendSubscription(body);
  }
};
