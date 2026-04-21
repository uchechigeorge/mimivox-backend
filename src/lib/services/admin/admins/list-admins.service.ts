import adminRepo from "@/lib/repositories/admin.repo";
import { AdminListMetaResponse } from "./types";
import { AdminListParams, AdminReadDto } from "@/lib/dtos/admin/admin.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { adminReadDtoValidator } from "@/lib/validators/admin/admin.validator";

export const listAdmins = async (
  params: AdminListParams,
): Promise<[AdminReadDto[], AdminListMetaResponse]> => {
  const [data, total] = await adminRepo.query(
    {
      ...params,
    },
    { includeRelations: true },
  );

  const dto: AdminReadDto[] = await parseArr(data, adminReadDtoValidator);

  const meta: AdminListMetaResponse = {
    total,
  };

  return [dto, meta];
};
