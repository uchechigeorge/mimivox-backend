import { CreditPackageListParams } from "@/lib/dtos/admin/credit.dto";
import creditPurchaseRepo from "@/lib/repositories/credit-purchase.repo";
import { parseArr } from "@/lib/utils/zod.utils";
import { creditPurchaseReadDtoValidator } from "@/lib/validators/admin/credit.validator";

export const listCreditPurchases = async (params: CreditPackageListParams) => {
  const data = await creditPurchaseRepo.listAll(params.type);

  return await parseArr(data, creditPurchaseReadDtoValidator);
};
