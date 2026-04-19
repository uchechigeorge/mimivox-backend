import { env } from "@/lib/config/env.config";
import { XaiVideoGetResponse } from "./types";

export const getVideo = async (requestId: string) => {
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

  // const response = (await clonedRes.json()) as XaiVideoGetResponse;

  return res;
};
