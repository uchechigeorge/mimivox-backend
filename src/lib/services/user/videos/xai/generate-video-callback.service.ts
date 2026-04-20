import { XaiVideoGetResponse, XaiVideoData, UploadVideoResult } from "./types";
import { BadRequestError } from "@/lib/utils/error.util";
import { upload } from "@/lib/utils/cloudinary.utils";
import taskRepo from "@/lib/repositories/task.repo";
import { prisma } from "@/lib/db/prisma";
import { getVideo } from "./get-video.service";
import videoRepo from "@/lib/repositories/video.repo";

export const generateVideoCallBack = async (requestId: string) => {
  const task = await taskRepo.getByReference(requestId, "Video", "Xai");
  if (!task) throw new BadRequestError("Task not found");

  const videoRes = await getVideo(task.referenceId, true);
  if (!videoRes.ok) {
    throw new BadRequestError("Could not get video");
  }

  const videoResult = (await videoRes.json()) as XaiVideoGetResponse;

  if (videoResult.status === "done") {
    // Upload
    const uploadedVideo = await upload(
      videoResult.video.url,
      "generated-videos",
    );

    await prisma.$transaction(async (tx) => {
      await videoRepo.create(
        {
          userId: task.userId,
          userName: task.userName,
          prompt: task.serviceRequestLog
            ? JSON.parse(task.serviceRequestLog?.toString()).body.prompt
            : "",
          title: "",
          altUrl: videoResult.video.url,
          url: uploadedVideo.url,
          durationInSeconds: videoResult.video.duration,
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
    });
  } else if (videoResult.status === "failed") {
  }
};
