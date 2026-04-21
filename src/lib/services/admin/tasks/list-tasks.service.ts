import taskRepo from "@/lib/repositories/task.repo";
import { TaskListMetaResponse } from "./types";
import { TaskListParams, TaskReadDto } from "@/lib/dtos/admin/task.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { taskReadDtoValidator } from "@/lib/validators/admin/task.validator";
import { AdminAuthItems } from "@/lib/types";

export const listTasks = async (
  params: TaskListParams,
  authItems: AdminAuthItems,
): Promise<[TaskReadDto[], TaskListMetaResponse]> => {
  const [data, total] = await taskRepo.query({
    ...params,
  });

  const dto: TaskReadDto[] = await parseArr(data, taskReadDtoValidator);

  const meta: TaskListMetaResponse = {
    total,
  };

  return [dto, meta];
};
