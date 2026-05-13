import { getSubscriptionPayment } from "./get-subscription-payment.service";
import { listSubscriptionPayments } from "./list-subscription-payments.service";

const subscriptionPaymentService = {
  listSubscriptionPayments,
  getSubscriptionPayment,
};

export default subscriptionPaymentService;
