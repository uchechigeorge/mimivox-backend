import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import { handleSubscriptionPayment } from "./handle-subscription-payment.service";

export const onChargeSuccess = async (body: HandlePaystackWebhookDto) => {
  if (body.data.metadata?.type === "SubscriptionPayment") {
    await handleSubscriptionPayment(body);
  } else if (body.data.metadata?.type === "OneTimePayment") {
    // await handleBookPurchasePayment(body);
  } else if (body.data.plan && body.data.plan.plan_code) {
    // await extendSubscription(body);
  }
};
