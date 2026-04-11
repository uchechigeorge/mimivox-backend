import { env } from "@/lib/config/env.config";
import { UserAuthItems } from "@/lib/types";

export const listGoogleVoices = async (authItems?: UserAuthItems) => {
  const url = `https://texttospeech.googleapis.com/v1/voices?key=${env.GOOGLE_API_KEY}`;
  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    const clonedRes = res.clone();
    const errorText = await clonedRes.text();

    console.error("==> ERROR:", errorText);
    return res;
  }

  return res;
};
