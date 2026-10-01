import { Task } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import imageRepo from "@/lib/repositories/image.repo";
import taskRepo from "@/lib/repositories/task.repo";
import { InternalServerError } from "@/lib/utils/error.util";
import runwayService from "@/lib/services/shared/runway";
import { RunwayTask } from "@/lib/services/shared/runway/types";
import { upload } from "@/lib/utils/cloudinary.utils";
import { reverseCredits } from "../base.service";
import { RunwayImageStatusResponse, RunwayImageTaskLog } from "./types";

const getCompletedResponse = async (
  task: Task,
): Promise<RunwayImageStatusResponse> => {
  const images = await imageRepo.listByTaskId(task.id);

  return {
    id: task.id,
    status: "done",
    progress: 1,
    data: images.map((image) => ({ url: image.url })),
  };
};

const completeTask = async (
  task: Task,
  runwayTask: RunwayTask,
): Promise<RunwayImageStatusResponse> => {
  // Another request is already finalizing this task
  if (!(await taskRepo.claimPending(task.id, "Started"))) {
    return { id: task.id, status: "running", progress: 1, data: [] };
  }

  try {
    const outputs = runwayTask.output ?? [];
    if (!outputs.length) throw new Error("Runway task has no output");

    const log = task.serviceRequestLog as unknown as RunwayImageTaskLog;
    const uploads = await Promise.all(
      outputs.map((url) => upload(url, "generated-images")),
    );

    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < uploads.length; i++) {
        await imageRepo.create(
          {
            userId: task.userId,
            userName: task.userName,
            prompt: log.body.promptText ?? "",
            title: "",
            url: uploads[i].secure_url,
            altUrl: outputs[i],
            imageServiceType: "Runway",
            imageServiceRequestLog: task.serviceRequestLog!,
            taskId: task.id,
          },
          tx,
        );
      }

      await taskRepo.update(
        task.id,
        {
          status: "Completed",
          progress: 100,
          resultUrl: uploads[0].secure_url,
          completedAt: new Date(),
        },
        tx,
      );
    });
  } catch (err) {
    // Release the claim so the next poll can retry
    await taskRepo.update(task.id, { status: "Pending" });
    console.error(`Could not save Runway image for task ${task.id}`, err);
    throw new InternalServerError(
      "Your image is ready but could not be saved yet. It will be retried automatically.",
    );
  }

  return await getCompletedResponse(task);
};

const failTask = async (
  task: Task,
  runwayTask: RunwayTask,
): Promise<RunwayImageStatusResponse> => {
  const error = runwayTask.failure ?? runwayTask.status;

  if (await taskRepo.claimPending(task.id, "Failed")) {
    await taskRepo.update(task.id, {
      errorMessage: error,
      completedAt: new Date(),
    });

    if (task.userId) {
      const log = task.serviceRequestLog as unknown as RunwayImageTaskLog;
      await reverseCredits(
        { userId: task.userId, loggedIn: true },
        undefined,
        log.creditsPerImage,
        log.noOfImages ?? 1,
      );
    }
  }

  return { id: task.id, status: "failed", progress: 0, error, data: [] };
};

// Checks a Runway image task and finalizes it once Runway is done
export const syncImageTask = async (
  task: Task,
): Promise<RunwayImageStatusResponse> => {
  if (task.status === "Completed") return await getCompletedResponse(task);
  if (task.status === "Failed") {
    return {
      id: task.id,
      status: "failed",
      progress: 0,
      error: task.errorMessage,
      data: [],
    };
  }
  if (task.status === "Started") {
    return { id: task.id, status: "running", progress: 1, data: [] };
  }

  const runwayTask = await runwayService.getTask(task.referenceId);

  switch (runwayTask.status) {
    case "SUCCEEDED":
      return await completeTask(task, runwayTask);
    case "FAILED":
    case "CANCELLED":
      return await failTask(task, runwayTask);
    default: {
      // Keep the latest progress on the task for the library and admin
      const percent = Math.round((runwayTask.progress ?? 0) * 100);
      if (percent !== task.progress) {
        await taskRepo.update(task.id, { progress: percent });
      }

      return {
        id: task.id,
        status: runwayTask.status === "RUNNING" ? "running" : "pending",
        progress: runwayTask.progress ?? 0,
        data: [],
      };
    }
  }
};
