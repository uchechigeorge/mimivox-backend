import userRepo from "@/lib/repositories/user.repo";
import { UserListMetaResponse } from "./types";
import { UserListParams, UserReadDto } from "@/lib/dtos/admin/user.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { userReadDtoValidator } from "@/lib/validators/admin/user.validator";

export const listUsers = async (
  params: UserListParams,
): Promise<[UserReadDto[], UserListMetaResponse]> => {
  const [[data, total], summary] = await Promise.all([
    userRepo.query(
      {
        ...params,
      },
      { includeRelations: true },
    ),
    userRepo.getSubscriberSummary(params),
  ]);

  const dto: UserReadDto[] = await parseArr(data, userReadDtoValidator);

  const meta: UserListMetaResponse = {
    total,
    summary,
  };

  return [dto, meta];
};
