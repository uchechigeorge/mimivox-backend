import { env } from "@/lib/config/env";
import { BadRequestError } from "@/lib/utils/error.util";

export const getVoices = async () => {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/voices?key=${env.GOOGLE_API_KEY}`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    throw new BadRequestError("Could not fetch voices");
  }

  const result = (await res.json()) as GoogleVoicesResponse;
  return result;
};

export type GoogleVoice = {
  languageCodes: string[];
  name: string;
  ssmlGender: "MALE" | "FEMALE" | "NEUTRAL";
  naturalSampleRateHertz: number;
};

export type GoogleVoicesResponse = {
  voices: GoogleVoice[];
};
