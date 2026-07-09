import { XaiVideoGetResponse } from "./types";
import { BadRequestError } from "@/lib/utils/error.util";
import { uploadVideo } from "@/lib/utils/cloudinary.utils";
import taskRepo from "@/lib/repositories/task.repo";
import { prisma } from "@/lib/db/prisma";
import { getVideo } from "./get-video.service";
import videoRepo from "@/lib/repositories/video.repo";
import { Task, Video } from "@/generated/prisma/client";
import { applyCredits, reverseCredits } from "../base.service";

export const generateVideoCallBack = async (
  requestId: string,
  videoData?: XaiVideoGetResponse,
  task?: Task,
): Promise<Video | null> => {
  if (!task) {
    const taskRes = await taskRepo.getByReference(requestId, "Video", "Xai");
    if (!taskRes) throw new BadRequestError("Task not found");

    task = taskRes;
  }

  if (!videoData) {
    const videoRes = await getVideo(task.referenceId, true);
    if (!videoRes.ok) {
      throw new BadRequestError("Could not get video");
    }

    videoData = (await videoRes.json()) as XaiVideoGetResponse;
  }

  let video: Video | null = null;

  if (videoData.status === "done") {
    // Upload
    const uploadedVideo = await uploadVideo(
      videoData.video.url,
      "generated-videos",
    );

    await prisma.$transaction(async (tx) => {
      video = await videoRepo.create(
        {
          userId: task.userId,
          userName: task.userName,
          prompt: task.serviceRequestLog
            ? JSON.parse(JSON.stringify(task.serviceRequestLog)).body.prompt
            : "",
          title: "",
          altUrl: videoData.video.url,
          url: uploadedVideo.secure_url,
          durationInSeconds: videoData.video.duration,
          videoServiceType: "Xai",
          videoServiceReferenceId: null,
          videoServiceRequestLog: task.serviceRequestLog!,
          taskId: task.id,
        },
        tx,
      );

      await taskRepo.update(
        task.id,
        {
          status: "Completed",
        },
        tx,
      );

      if (task.userId) {
        await applyCredits(task.userId, videoData.video.duration, tx);
      }
    });
  } else if (videoData.status === "failed") {
    if (task.userId) {
      await reverseCredits(task.userId);
    }
  }

  return video;
};
