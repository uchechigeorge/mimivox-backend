import { TaskGetParams, TaskReadDto } from "@/lib/dtos/user/task.dto";
import taskRepo from "@/lib/repositories/task.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError, UnauthorizedError } from "@/lib/utils/error.util";
import { taskReadDtoValidator } from "@/lib/validators/user/task.validator";
import xaiVideoService from "../videos/xai";

export const getTask = async (
  params: TaskGetParams,
  authItems: UserAuthItems,
): Promise<TaskReadDto> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const [data, total] = await taskRepo.query(
    {
      id: params.id,
      userId,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const task = data[0];
  if (task.status === "Pending") {
    if (task.type === "Video" && task.serviceOption === "Xai") {
      await xaiVideoService.generateVideoCallBack(task.referenceId);
    }
  }

  const dto = await taskReadDtoValidator.parseAsync(data[0]);

  return dto;
};
