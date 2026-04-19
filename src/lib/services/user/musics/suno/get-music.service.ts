import { env } from "@/lib/config/env.config";

export const getMusic = async (taskId: string) => {
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

  return res;
};
