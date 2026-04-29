import { env } from "@/lib/config/env.config";
import { XaiVideoGenerateRequestBody, XaiVideoGenerateResponse } from "./types";
import { UserAuthItems } from "@/lib/types";
import { reverseCredits, validate } from "../base.service";
import { createTask } from "./base.service";

export const generateVideo = async (
  body: XaiVideoGenerateRequestBody,
  authItems: UserAuthItems,
) => {
  const { user, duration } = await validate({ prompt: body.prompt, authItems });

  if (duration) {
    body.duration = duration;
  }

  const url = `https://api.x.ai/v1/videos/generations`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.XAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const clonedRes = res.clone();
  // Handle non-200 responses
  if (!res.ok) {
    const errorText = await clonedRes.text();
    console.log(errorText);

    await reverseCredits(authItems);
    return res;
  }

  const response = (await clonedRes.json()) as XaiVideoGenerateResponse;

  await createTask(response, user, {
    url,
    body,
  });

  return res;
};
