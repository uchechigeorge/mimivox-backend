import { Task } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import taskRepo from "@/lib/repositories/task.repo";
import videoRepo from "@/lib/repositories/video.repo";
import runwayService from "@/lib/services/shared/runway";
import { RunwayTask } from "@/lib/services/shared/runway/types";
import { uploadVideo } from "@/lib/utils/cloudinary.utils";
import { applyCredits, reverseCredits } from "../base.service";
import { RunwayVideoStatusResponse, RunwayVideoTaskLog } from "./types";

const getCompletedResponse = async (
  task: Task,
): Promise<RunwayVideoStatusResponse> => {
  const video = await videoRepo.getByTaskId(task.id);

  return {
    id: task.id,
    status: "done",
    progress: 1,
    video: video ? { url: video.url, duration: video.durationInSeconds } : null,
  };
};

const completeTask = async (
  task: Task,
  runwayTask: RunwayTask,
): Promise<RunwayVideoStatusResponse> => {
  // Another request is already finalizing this task
  if (!(await taskRepo.claimPending(task.id, "Started"))) {
    return { id: task.id, status: "running", progress: 1 };
  }

  try {
    const outputUrl = runwayTask.output?.[0];
    if (!outputUrl) throw new Error("Runway task has no output");

    const log = task.serviceRequestLog as unknown as RunwayVideoTaskLog;
    const uploadedVideo = await uploadVideo(outputUrl, "generated-videos");

    await prisma.$transaction(async (tx) => {
      await videoRepo.create(
        {
          userId: task.userId,
          userName: task.userName,
          prompt: log.body.promptText ?? "",
          title: "",
          altUrl: outputUrl,
          url: uploadedVideo.secure_url,
          durationInSeconds: log.duration,
          videoServiceType: "Runway",
          videoServiceReferenceId: runwayTask.id,
          videoServiceRequestLog: task.serviceRequestLog!,
          taskId: task.id,
        },
        tx,
      );

      await taskRepo.update(
        task.id,
        {
          status: "Completed",
          progress: 100,
          resultUrl: uploadedVideo.secure_url,
          completedAt: new Date(),
        },
        tx,
      );

      if (task.userId) {
        await applyCredits(task.userId, log.duration, tx, log.creditsPerSecond);
      }
    });
  } catch (err) {
    // Release the claim so the next poll can retry
    await taskRepo.update(task.id, { status: "Pending" });
    throw err;
  }

  return await getCompletedResponse(task);
};

const failTask = async (
  task: Task,
  runwayTask: RunwayTask,
): Promise<RunwayVideoStatusResponse> => {
  const error = runwayTask.failure ?? runwayTask.status;

  if (await taskRepo.claimPending(task.id, "Failed")) {
    await taskRepo.update(task.id, {
      errorMessage: error,
      completedAt: new Date(),
    });

    if (task.userId) {
      await reverseCredits(task.userId);
    }
  }

  return { id: task.id, status: "failed", progress: 0, error };
};

// Checks a Runway video task and finalizes it once Runway is done
export const syncVideoTask = async (
  task: Task,
): Promise<RunwayVideoStatusResponse> => {
  if (task.status === "Completed") return await getCompletedResponse(task);
  if (task.status === "Failed") {
    return {
      id: task.id,
      status: "failed",
      progress: 0,
      error: task.errorMessage,
    };
  }
  if (task.status === "Started") {
    return { id: task.id, status: "running", progress: 1 };
  }

  const runwayTask = await runwayService.getTask(task.referenceId);

  switch (runwayTask.status) {
    case "SUCCEEDED":
      return await completeTask(task, runwayTask);
    case "FAILED":
    case "CANCELLED":
      return await failTask(task, runwayTask);
    default:
      return {
        id: task.id,
        status: runwayTask.status === "RUNNING" ? "running" : "pending",
        progress: runwayTask.progress ?? 0,
      };
  }
};
