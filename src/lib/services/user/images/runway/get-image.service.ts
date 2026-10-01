import taskRepo from "@/lib/repositories/task.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError, UnauthorizedError } from "@/lib/utils/error.util";
import { imageGetParamsValidator } from "@/lib/validators/user/image.validator";
import { syncImageTask } from "./sync-image-task.service";

export const getImage = async (id: string, authItems: UserAuthItems) => {
  if (!authItems.userId) throw new UnauthorizedError();

  const params = imageGetParamsValidator.parse({ id });
  const task = await taskRepo.getById(params.id);
  if (
    !task ||
    task.userId !== authItems.userId ||
    task.type !== "Image" ||
    task.serviceOption !== "Runway"
  ) {
    throw new NotFoundError();
  }

  return await syncImageTask(task);
};
