import { nDate, nNumber, nString, rString } from "@/lib/utils/zod.utils";
import { z } from "zod";

const creditPackageType = z.enum(["TopUp", "BuyCredit"]);

export const creditPackageListParamsValidator = z.object({
  type: creditPackageType.optional(),
});

export const creditPackageReadValidator = z.object({
  id: nString,
  slug: nString,
  name: nString,
  description: nString,
  type: creditPackageType,
  price: nNumber,
  noOfCredits: nNumber,
  sequence: nNumber,
});

export const creditPurchaseCreateValidator = z.object({
  packageId: rString,
});

export const creditPurchaseGetByPaymentTokenParamsValidator = z.object({
  id: z.string(),
});

export const creditPurchaseReadValidator = z.object({
  id: nString,
  reference: nString,
  paymentToken: nString,
  packageId: nString,
  packageName: nString,
  type: creditPackageType,
  noOfCredits: nNumber,
  amount: nNumber,
  amountPaid: nNumber,
  currency: nString,
  status: nString,
  paymentVerified: z.boolean().catch(false),
  paidAt: nDate,
  createdAt: nDate,
});
