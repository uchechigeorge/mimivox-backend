import {
  createCreditPackage,
  deleteCreditPackage,
  getCreditPackage,
  listCreditPackages,
  updateCreditPackage,
} from "./credit-packages.service";
import { listCreditPurchases } from "./list-credit-purchases.service";

const creditService = {
  listCreditPackages,
  getCreditPackage,
  createCreditPackage,
  updateCreditPackage,
  deleteCreditPackage,
  listCreditPurchases,
};

export default creditService;
