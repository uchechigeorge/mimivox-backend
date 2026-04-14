import { AdminGetParams, AdminReadDto } from "@/lib/dtos/admin/admin.dto";
import adminRepo from "@/lib/repositories/admin.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { adminReadDtoValidator } from "@/lib/validators/admin/admin.validator";

export const getAdmin = async (
  params: AdminGetParams,
  authItems: AdminAuthItems,
): Promise<AdminReadDto> => {
  const [data, total] = await adminRepo.query({
    id: params.id,
  });
  if (total < 1) throw new NotFoundError();

  const dto = await adminReadDtoValidator.parseAsync(data[0]);

  return dto;
};
