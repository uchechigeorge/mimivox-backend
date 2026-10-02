import { SunoMusicCallbackRequestBody } from "./types";
import { BadRequestError } from "@/lib/utils/error.util";
import taskRepo from "@/lib/repositories/task.repo";
import { getMusic } from "./get-music.service";

export const generateMusicCallBack = async (
  body: SunoMusicCallbackRequestBody,
) => {
  const taskId = body?.data?.task_id;
  if (!taskId) throw new BadRequestError("Missing task id");

  // "text" and "first" are progress updates; wait for the final callback
  const callbackType = body.data.callbackType;
  if (callbackType !== "complete" && callbackType !== "error") return;

  const task = await taskRepo.getByReference(taskId, "Music", "Suno");
  if (!task) throw new BadRequestError("Task not found");

  // Suno does not sign callbacks, so instead of trusting the body, fetch the
  // task's status from Suno. getMusic saves or fails the task exactly once,
  // the same way the status polling does.
  await getMusic({ taskId });
};
