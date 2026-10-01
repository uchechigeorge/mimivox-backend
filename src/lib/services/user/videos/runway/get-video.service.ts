import taskRepo from "@/lib/repositories/task.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError, UnauthorizedError } from "@/lib/utils/error.util";
import { videoGetParamsValidator } from "@/lib/validators/user/video.validator";
import { syncVideoTask } from "./sync-video-task.service";

export const getVideo = async (id: string, authItems: UserAuthItems) => {
  if (!authItems.userId) throw new UnauthorizedError();

  const params = videoGetParamsValidator.parse({ id });
  const task = await taskRepo.getById(params.id);
  if (
    !task ||
    task.userId !== authItems.userId ||
    task.type !== "Video" ||
    task.serviceOption !== "Runway"
  ) {
    throw new NotFoundError();
  }

  return await syncVideoTask(task);
};
