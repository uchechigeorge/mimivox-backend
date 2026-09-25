import { env } from "@/lib/config/env.config";
import taskRepo from "@/lib/repositories/task.repo";
import {
  SunoMusicGenerateStatusResponse,
  SunoMusicProcessStatusParams,
} from "./types";
import { saveMusics } from "./save-musics.service";
import { reverseCredits } from "../base.service";

export const processMusicStatus = async (
  params?: SunoMusicProcessStatusParams,
) => {
  const completedTaskIds: string[] = [];
  const nonCompletedTasks: { id: string; error: any }[] = [];
  const ignoreReversal = params?.ignoreReversal ?? false;

  const tasks = (
    await taskRepo.listByStatus("Pending", "Music", "Suno")
  ).splice(0, params?.maxTasksToProcess ?? 10);
  for (const task of tasks) {
    const url = `https://api.sunoapi.org/api/v1/generate/record-info?taskId=${task.referenceId}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.SUNO_API_KEY}`,
      },
    });

    const response = res.ok
      ? ((await res.clone().json()) as SunoMusicGenerateStatusResponse)
      : null;
    // Handle non-200 responses
    if (!res.ok || !response || response.data == null) {
      const errorText = await res.clone().text();
      console.error(errorText);

      nonCompletedTasks.push({
        id: task.referenceId,
        error: { message: errorText },
      });
      continue;
    }

    if (task && task.status === "Pending") {
      // console.dir(
      //   { response },
      //   {
      //     depth: 5,
      //   },
      // );

      if (response.data.status == "SUCCESS") {
        await saveMusics({
          task,
          musicItems: response.data.response.sunoData,
        });

        completedTaskIds.push(task.referenceId);
      } else {
        const error = {
          status: response.data.status,
          code: response.data.errorCode,
          message: response.data.errorMessage,
        };
        if (!ignoreReversal && task.userId) {
          await reverseCredits(task.userId);
        }

        await taskRepo.update(task.id, {
          errorMessage: response.data.status,
          status: "Failed",
          completedAt: new Date(),
        });
        nonCompletedTasks.push({ id: task.referenceId, error });
      }
    }
  }

  return {
    completedTaskIds,
    nonCompletedTasks,
    pendingTaskIds: tasks.map((task) => task.referenceId),
  };
};
