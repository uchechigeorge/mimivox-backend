import userRepo from "@/lib/repositories/user.repo";
import { UserListMetaResponse } from "./types";
import { UserListParams, UserReadDto } from "@/lib/dtos/admin/user.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { userReadDtoValidator } from "@/lib/validators/admin/user.validator";

export const listUsers = async (
  params: UserListParams,
): Promise<[UserReadDto[], UserListMetaResponse]> => {
  const [data, total] = await userRepo.query(
    {
      ...params,
    },
    { includeRelations: true },
  );

  const dto: UserReadDto[] = await parseArr(data, userReadDtoValidator);

  const meta: UserListMetaResponse = {
    total,
  };

  return [dto, meta];
};
