import { checkExpiry } from "./check-expiry.service";
import { generateInvoices } from "./create-invoice.service";

const subscriptionService = {
  checkExpiry,
  generateInvoices,
};

export default subscriptionService;
