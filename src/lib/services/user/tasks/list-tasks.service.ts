import taskRepo from "@/lib/repositories/task.repo";
import { ListTasksMetaResponse } from "./types";
import { TaskListParams, TaskReadDto } from "@/lib/dtos/user/task.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { taskReadDtoValidator } from "@/lib/validators/user/task.validator";
import { UserAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";

export const listTasks = async (
  params: TaskListParams,
  authItems: UserAuthItems,
): Promise<[TaskReadDto[], ListTasksMetaResponse]> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await taskRepo.query(
    {
      ...params,
      userId,
    },
    { includeRelations: true },
  );

  const dto: TaskReadDto[] = await parseArr(data, taskReadDtoValidator);

  const meta: ListTasksMetaResponse = {
    total,
  };

  return [dto, meta];
};
