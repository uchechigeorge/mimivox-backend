import {
  CreditPackageCreateDto,
  CreditPackageListParams,
  CreditPackageUpdateDto,
} from "@/lib/dtos/admin/credit.dto";
import creditPackageRepo from "@/lib/repositories/credit-package.repo";
import { BadRequestError, NotFoundError } from "@/lib/utils/error.util";
import { parseArr } from "@/lib/utils/zod.utils";
import { creditPackageReadDtoValidator } from "@/lib/validators/admin/credit.validator";

export const listCreditPackages = async (params: CreditPackageListParams) => {
  const data = await creditPackageRepo.list(params.type);

  return await parseArr(data, creditPackageReadDtoValidator);
};

export const getCreditPackage = async (id: string) => {
  const creditPackage = await creditPackageRepo.getById(id);
  if (!creditPackage) throw new NotFoundError("Credit package not found");

  return creditPackageReadDtoValidator.parse(creditPackage);
};

export const createCreditPackage = async (dto: CreditPackageCreateDto) => {
  const existing = await creditPackageRepo.getBySlug(dto.slug);
  if (existing) throw new BadRequestError("A package with this slug exists");

  const created = await creditPackageRepo.create(dto);

  return creditPackageReadDtoValidator.parse(created);
};

// Purchases already started keep the price and credits they were created with
export const updateCreditPackage = async (
  id: string,
  dto: CreditPackageUpdateDto,
) => {
  const creditPackage = await creditPackageRepo.getById(id);
  if (!creditPackage) throw new NotFoundError("Credit package not found");

  const updated = await creditPackageRepo.update(id, dto);

  return creditPackageReadDtoValidator.parse(updated);
};

// Soft delete: users stop seeing it, past purchases keep their record
export const deleteCreditPackage = async (id: string) => {
  const creditPackage = await creditPackageRepo.getById(id);
  if (!creditPackage) throw new NotFoundError("Credit package not found");

  await creditPackageRepo.update(id, { deletedAt: new Date() });
};
