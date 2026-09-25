import { env } from "@/lib/config/env.config";
import taskRepo from "@/lib/repositories/task.repo";
import { SunoMusicGenerateStatusResponse, SunoMusicGetParams } from "./types";
import { saveMusics } from "./save-musics.service";
import { reverseCredits } from "../base.service";

export const getMusic = async (params: SunoMusicGetParams) => {
  const { taskId, ignoreUpdate, ignoreReversal } = params;
  const url = `https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.SUNO_API_KEY}`,
    },
  });

  // const clonedRes = res.clone();
  // Handle non-200 responses
  if (!res.ok) {
    const errorText = await res.clone().text();
    console.error(errorText);

    return res;
  }

  if (!ignoreUpdate) {
    const task = await taskRepo.getByReference(taskId, "Music", "Suno");
    if (task && task.status === "Pending") {
      const response = (await res
        .clone()
        .json()) as SunoMusicGenerateStatusResponse;

      if (response.data.status == "SUCCESS") {
        await saveMusics({
          task,
          musicItems: response.data.response.sunoData,
        });
      } else {
        if (!ignoreReversal && task.userId) {
          // Reverse credits if the task failed
          await reverseCredits(task.userId);
        }

        await taskRepo.update(task.id, {
          errorMessage: response.data.status,
          status: "Failed",
          completedAt: new Date(),
        });
      }
    }
  }

  return res;
};
