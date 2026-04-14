import adminRepo from "@/lib/repositories/admin.repo";
import { ListAdminsMetaResponse } from "./types";
import { AdminListParams, AdminReadDto } from "@/lib/dtos/admin/admin.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { adminReadDtoValidator } from "@/lib/validators/admin/admin.validator";

export const listAdmins = async (
  params: AdminListParams,
): Promise<[AdminReadDto[], ListAdminsMetaResponse]> => {
  const [data, total] = await adminRepo.query(
    {
      ...params,
    },
    { includeRelations: true },
  );

  const dto: AdminReadDto[] = await parseArr(data, adminReadDtoValidator);

  const meta: ListAdminsMetaResponse = {
    total,
  };

  return [dto, meta];
};
