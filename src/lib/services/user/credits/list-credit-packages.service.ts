import { CreditPackageListParams } from "@/lib/dtos/user/credit.dto";
import creditPackageRepo from "@/lib/repositories/credit-package.repo";
import { parseArr } from "@/lib/utils/zod.utils";
import { creditPackageReadValidator } from "@/lib/validators/user/credit.validator";

export const listCreditPackages = async (params: CreditPackageListParams) => {
  const data = await creditPackageRepo.list(params.type);

  return await parseArr(data, creditPackageReadValidator);
};
