import { env } from "@/lib/config/env.config";
import taskRepo from "@/lib/repositories/task.repo";
import { generateMusicCallBack } from "./generate-music-callback.service";
import { SunoMusicCallbackRequestBody } from "./types";

export const getMusic = async (taskId: string, ignoreUpdate?: boolean) => {
  const url = `https://api.sunoapi.org/api/v1/generate/record-info?taskId=${taskId}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.SUNO_API_KEY}`,
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
    const task = await taskRepo.getByReference(taskId, "Music", "Suno");
    if (task && task.status === "Pending") {
      if (task.type === "Music" && task.serviceOption === "Suno") {
        const response =
          (await clonedRes.json()) as SunoMusicCallbackRequestBody;
        await generateMusicCallBack(response);
      }
    }
  }

  return res;
};
