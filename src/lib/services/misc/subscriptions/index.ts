import { checkExpiry } from "./check-expiry.service";
import { generateInvoices } from "./generate-invoices.service";

const subscriptionService = {
  checkExpiry,
  generateInvoices,
};

export default subscriptionService;
