import { env } from "@/lib/config/env";
import { UserAuthItems } from "@/lib/types";

export const generateViaElevenLabs = async (
  voiceId: string,
  body: any,
  authItems: UserAuthItems,
) => {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();

    console.error("==> ERROR:", errorText);
    return new Response(errorText, { status: res.status });
  }

  return res;
};
