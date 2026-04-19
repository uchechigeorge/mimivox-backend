import taskRepo from "@/lib/repositories/task.repo";
import { ListTasksMetaResponse } from "./types";
import { TaskListParams, TaskReadDto } from "@/lib/dtos/user/task.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { taskReadDtoValidator } from "@/lib/validators/user/task.validator";

export const listTasks = async (
  params: TaskListParams,
): Promise<[TaskReadDto[], ListTasksMetaResponse]> => {
  const [data, total] = await taskRepo.query(
    {
      ...params,
    },
    { includeRelations: true },
  );

  const dto: TaskReadDto[] = await parseArr(data, taskReadDtoValidator);

  const meta: ListTasksMetaResponse = {
    total,
  };

  return [dto, meta];
};
