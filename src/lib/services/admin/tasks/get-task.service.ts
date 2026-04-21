import { TaskGetParams, TaskReadDto } from "@/lib/dtos/admin/task.dto";
import taskRepo from "@/lib/repositories/task.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { taskReadDtoValidator } from "@/lib/validators/admin/task.validator";

export const getTask = async (
  params: TaskGetParams,
  authItems: AdminAuthItems,
): Promise<TaskReadDto> => {
  const [data, total] = await taskRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await taskReadDtoValidator.parseAsync(data[0]);

  return dto;
};
