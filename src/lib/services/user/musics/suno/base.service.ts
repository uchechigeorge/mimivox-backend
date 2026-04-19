import { SunoMusicGenerateResponse } from "./types";
import { User } from "@/generated/prisma/client";
import taskRepo from "@/lib/repositories/task.repo";

export const createTask = async (
  response: SunoMusicGenerateResponse,
  user: User,
  log?: any,
) => {
  await taskRepo.create({
    userId: user.id,
    userName: user.fullName,
    referenceId: response.data.taskId,
    serviceOption: "Suno",
    type: "Music",
    serviceRequestLog: log,
  });
};
