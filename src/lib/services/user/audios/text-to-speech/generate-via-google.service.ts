import { env } from "@/lib/config/env";
import { UserAuthItems } from "@/lib/types";

export const generateViaGoogle = async (
  body: any,
  authItems: UserAuthItems,
) => {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${env.GOOGLE_API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  // const base64 = res.data.audioContent;
  // const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  // const blob = new Blob([bytes], { type: "audio/mpeg" });
  // return URL.createObjectURL(blob);

  return res;
};
