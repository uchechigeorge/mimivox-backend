import { env } from "@/lib/config/env.config";
import taskRepo from "@/lib/repositories/task.repo";
import {
  SunoMusicGenerateStatusResponse,
  SunoMusicProcessStatusParams,
} from "./types";
import { saveMusics } from "./save-musics.service";
import { sunoFailureStatuses } from "./base.service";
import { reverseCredits } from "../base.service";
import { prisma } from "@/lib/db/prisma";
import { notifyTaskFinished } from "@/lib/services/user/notifications/notify-task-finished.service";

// Songs still not done after this long are failed and refunded
const SUNO_TIMEOUT_MS = 60 * 60 * 1000;

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
        const timedOut =
          Date.now() - task.createdAt.getTime() > SUNO_TIMEOUT_MS;

        // Still generating (PENDING, TEXT_SUCCESS, FIRST_SUCCESS): check again next run
        if (!sunoFailureStatuses.has(response.data.status) && !timedOut) {
          continue;
        }

        const status = sunoFailureStatuses.has(response.data.status)
          ? response.data.status
          : "TIMED_OUT";
        const error = {
          status,
          code: response.data.errorCode,
          message: response.data.errorMessage,
        };

        // Only the call that fails the task refunds and emails
        const failed = await prisma.task.updateMany({
          where: { id: task.id, status: "Pending" },
          data: {
            errorMessage: status,
            status: "Failed",
            completedAt: new Date(),
          },
        });
        nonCompletedTasks.push({ id: task.referenceId, error });

        if (failed.count > 0) {
          if (!ignoreReversal && task.userId) {
            await reverseCredits(task.userId);
          }

          notifyTaskFinished(task, {
            succeeded: false,
            error:
              status === "TIMED_OUT"
                ? status
                : response.data.errorMessage || status,
            refunded: !ignoreReversal,
          });
        }
      }
    }
  }

  return {
    completedTaskIds,
    nonCompletedTasks,
    pendingTaskIds: tasks.map((task) => task.referenceId),
  };
};
