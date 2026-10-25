import { createCreditPurchase } from "./create-credit-purchase.service";
import {
  getCreditPurchaseByPaymentToken,
  listCreditPurchases,
} from "./get-credit-purchase.service";
import { listCreditPackages } from "./list-credit-packages.service";

const creditService = {
  listCreditPackages,
  createCreditPurchase,
  getCreditPurchaseByPaymentToken,
  listCreditPurchases,
};

export default creditService;
