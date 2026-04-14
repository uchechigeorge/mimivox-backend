import { UserGetParams, UserReadDto } from "@/lib/dtos/admin/user.dto";
import userRepo from "@/lib/repositories/user.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { userReadDtoValidator } from "@/lib/validators/admin/user.validator";

export const getUser = async (
  params: UserGetParams,
  authItems: AdminAuthItems,
): Promise<UserReadDto> => {
  const [data, total] = await userRepo.query({
    id: params.id,
  });
  if (total < 1) throw new NotFoundError();

  const dto = await userReadDtoValidator.parseAsync(data[0]);

  return dto;
};
