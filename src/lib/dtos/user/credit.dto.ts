import {
  creditPackageListParamsValidator,
  creditPackageReadValidator,
  creditPurchaseCreateValidator,
  creditPurchaseGetByPaymentTokenParamsValidator,
  creditPurchaseReadValidator,
} from "@/lib/validators/user/credit.validator";
import z from "zod";

export type CreditPackageListParams = z.infer<
  typeof creditPackageListParamsValidator
>;
export type ReadCreditPackageDto = z.infer<typeof creditPackageReadValidator>;
export type CreateCreditPurchaseDto = z.infer<
  typeof creditPurchaseCreateValidator
>;
export type GetCreditPurchaseByTokenParams = z.infer<
  typeof creditPurchaseGetByPaymentTokenParamsValidator
>;
export type ReadCreditPurchaseDto = z.infer<typeof creditPurchaseReadValidator>;
