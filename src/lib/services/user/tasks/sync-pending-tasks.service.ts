import { Task } from "@/generated/prisma/client";
import taskRepo from "@/lib/repositories/task.repo";
import runwayImageService from "../images/runway";
import runwayVideoService from "../videos/runway";
import xaiVideoService from "../videos/xai";

// Keeps library loads quick; the rest are picked up on the next load
const maxTasksPerSync = 5;

const syncTask = async (task: Task) => {
  if (task.serviceOption === "Runway") {
    return task.type === "Video"
      ? await runwayVideoService.syncVideoTask(task)
      : await runwayImageService.syncImageTask(task);
  }

  if (task.serviceOption === "Xai" && task.type === "Video") {
    return await xaiVideoService.generateVideoCallBack(
      task.referenceId,
      undefined,
      task,
    );
  }
};

// Finishes generations whose page was closed before they completed, so they
// land in the library (and failed ones are refunded) when the user opens it
export const syncPendingTasks = async (
  userId: string,
  type: "Video" | "Image",
) => {
  const tasks = await taskRepo.listPendingByUser(userId, type, maxTasksPerSync);

  const results = await Promise.allSettled(tasks.map(syncTask));
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(`Could not sync task ${tasks[i].id}`, result.reason);
    }
  });
};
