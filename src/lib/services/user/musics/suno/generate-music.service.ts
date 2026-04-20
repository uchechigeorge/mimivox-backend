import { UserAuthItems } from "@/lib/types";
import {
  SunoMusicGenerateRequestBody,
  SunoMusicGenerateResponse,
} from "./types";
import { reverseCredits, validate } from "../base.service";
import { env } from "@/lib/config/env.config";
import { createTask } from "./base.service";

export const generateMusic = async (
  body: SunoMusicGenerateRequestBody,
  authItems: UserAuthItems,
) => {
  const user = await validate({ prompt: body.prompt, authItems });

  const url = `https://api.sunoapi.org/api/v1/generate`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.SUNO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      callBackUrl: env.SUNO_MUSIC_GENERATE_CALLBACK_URL,
    }),
  });

  const clonedRes = res.clone();
  // Handle non-200 responses
  if (!res.ok) {
    const errorText = await clonedRes.text();
    console.log(errorText);

    await reverseCredits(authItems.userId);
    return res;
  }

  const response = (await clonedRes.json()) as SunoMusicGenerateResponse;
  if (response.code != 200) {
    console.log({ err: response });

    await reverseCredits(authItems.userId);
    return res;
  }

  console.log({ response });
  await createTask(response, user, {
    url,
    body,
  });

  return res;
};
