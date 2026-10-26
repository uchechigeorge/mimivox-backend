import { createCreditPurchase } from "./create-credit-purchase.service";
import {
  getCreditPurchaseByPaymentToken,
  listCreditPurchases,
} from "./get-credit-purchase.service";
import { listCreditPackages } from "./list-credit-packages.service";
import { listCreditGrants } from "./list-credit-grants.service";

const creditService = {
  listCreditPackages,
  createCreditPurchase,
  getCreditPurchaseByPaymentToken,
  listCreditPurchases,
  listCreditGrants,
};

export default creditService;
