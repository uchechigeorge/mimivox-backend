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

// Suno statuses that mean the song will not be generated; the rest are still in progress
export const sunoFailureStatuses = new Set<string>([
  "CREATE_TASK_FAILED",
  "GENERATE_AUDIO_FAILED",
  "CALLBACK_EXCEPTION",
  "SENSITIVE_WORD_ERROR",
]);
