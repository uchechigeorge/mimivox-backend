import { env } from "@/lib/config/env.config";
import { UserAuthItems } from "@/lib/types";
import { buildSearchParams } from "@/lib/utils/request.utils";

export const listElevenLabsVoices = async (
  params?: any,
  authItems?: UserAuthItems,
) => {
  const searchParams = buildSearchParams(params);
  const url = `https://api.elevenlabs.io/v2/voices?${searchParams}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "xi-api-key": env.ELEVENLABS_API_KEY,
    },
  });

  if (!res.ok) {
    const clonedRes = res.clone();
    const errorText = await clonedRes.text();

    console.error("==> ERROR:", errorText);
    return res;
  }

  return res;
};
