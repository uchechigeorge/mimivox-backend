import { env } from "@/lib/config/env.config";
import { prisma } from "@/lib/db/prisma";
import taskRepo from "@/lib/repositories/task.repo";
import { SunoMusicGenerateStatusResponse, SunoMusicGetParams } from "./types";
import { saveMusics } from "./save-musics.service";
import { applyCredits, reverseCredits } from "../base.service";
import userRepo from "@/lib/repositories/user.repo";
import { UnauthorizedError } from "@/lib/utils/error.util";

export const getMusic = async (params: SunoMusicGetParams) => {
  const { taskId, ignoreUpdate, ignoreReversal } = params;
  const url = `https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.SUNO_API_KEY}`,
    },
  });

  // Handle non-200 responses
  if (!res.ok) {
    const errorText = await res.clone().text();
    console.error(errorText);

    return res;
  }

  if (!ignoreUpdate) {
    const task = await taskRepo.getByReference(taskId, "Music", "Suno");
    if (task && (task.status === "Pending" || task.status === "Failed")) {
      const response = (await res
        .clone()
        .json()) as SunoMusicGenerateStatusResponse;

      if (response.data.status == "SUCCESS") {
        const claimedTask = await prisma.$transaction(async (tx) => {
          const claimedTask = await tx.task.updateMany({
            where: { id: task.id, status: task.status },
            data: {
              status: "Started",
              errorMessage: null,
              completedAt: null,
            },
          });

          if (claimedTask.count > 0 && task.status === "Failed") {
            const user = task.userId
              ? await userRepo.getByIdWithLock(task.userId, tx)
              : null;
            if (!user) throw new UnauthorizedError();

            await applyCredits(user, tx);
          }

          return claimedTask.count > 0;
        });

        if (claimedTask) {
          await saveMusics({
            task,
            musicItems: response.data.response.sunoData,
          });
        }
      } else if (response.data.status == "GENERATE_AUDIO_FAILED") {
        await prisma.$transaction(async (tx) => {
          const failedTask = await tx.task.updateMany({
            where: { id: task.id, status: "Pending" },
            data: {
              errorMessage: response.data.status,
              status: "Failed",
              completedAt: new Date(),
            },
          });

          if (!ignoreReversal && failedTask.count > 0 && task.userId) {
            await reverseCredits(task.userId, tx);
          }
        });
      }
    }
  }

  return res;
};
