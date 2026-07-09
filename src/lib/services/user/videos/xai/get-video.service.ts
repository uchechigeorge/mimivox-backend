import { env } from "@/lib/config/env.config";
import taskRepo from "@/lib/repositories/task.repo";
import { generateVideoCallBack } from "./generate-video-callback.service";
import { XaiVideoGetResponse } from "./types";
import { Video } from "@/generated/prisma/client";

export const getVideo = async (requestId: string, ignoreUpdate?: boolean) => {
  const url = `https://api.x.ai/v1/videos/${requestId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.XAI_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  const clonedRes = res.clone();
  // Handle non-200 responses
  if (!res.ok) {
    const errorText = await clonedRes.text();
    console.log(errorText);

    return res;
  }

  let video: Video | null = null;
  if (!ignoreUpdate) {
    const task = await taskRepo.getByReference(requestId, "Video", "Xai");
    if (task && task.status === "Pending") {
      video = await generateVideoCallBack(
        task.referenceId,
        await clonedRes.json(),
        task,
      );
    }
  }

  const videoData = (await res.json()) as XaiVideoGetResponse;
  if (videoData?.video?.url && video && video.url) {
    videoData.video.url = video.url;
  }
  const headers = new Headers(res.headers);

  // header cleanup
  headers.delete("content-encoding");
  headers.delete("transfer-encoding");

  return new Response(JSON.stringify(videoData), {
    status: res.status,
    headers,
  });
};
