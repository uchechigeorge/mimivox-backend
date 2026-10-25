import {
  creditPackageCreateDtoValidator,
  creditPackageListParamsValidator,
  creditPackageReadDtoValidator,
  creditPackageUpdateDtoValidator,
  creditPurchaseReadDtoValidator,
} from "@/lib/validators/admin/credit.validator";
import z from "zod";

export type CreditPackageListParams = z.infer<
  typeof creditPackageListParamsValidator
>;
export type CreditPackageReadDto = z.infer<
  typeof creditPackageReadDtoValidator
>;
export type CreditPackageCreateDto = z.infer<
  typeof creditPackageCreateDtoValidator
>;
export type CreditPackageUpdateDto = z.infer<
  typeof creditPackageUpdateDtoValidator
>;
export type CreditPurchaseReadDto = z.infer<
  typeof creditPurchaseReadDtoValidator
>;
