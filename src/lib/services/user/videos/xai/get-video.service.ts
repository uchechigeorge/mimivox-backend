import { env } from "@/lib/config/env.config";
import taskRepo from "@/lib/repositories/task.repo";
import { generateVideoCallBack } from "./generate-video-callback.service";

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

  if (!ignoreUpdate) {
    const task = await taskRepo.getByReference(requestId, "Video", "Xai");
    if (task && task.status === "Pending") {
      if (task.type === "Video" && task.serviceOption === "Xai") {
        await generateVideoCallBack(task.referenceId);
      }
    }
  }

  return res;
};
