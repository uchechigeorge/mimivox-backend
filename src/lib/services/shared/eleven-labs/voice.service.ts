import { env } from "@/lib/config/env.config";
import { BadRequestError } from "@/lib/utils/error.util";
import { buildSearchParams } from "@/lib/utils/request.utils";

export const listVoices = async (searchParams?: ListVoiceSearchParams) => {
  const queryString = buildSearchParams(searchParams);
  const res = await fetch(
    `https://api.elevenlabs.io/v1/voices?${queryString}`,
    {
      method: "GET",
      headers: {
        "xi-api-key": env.ELEVENLABS_API_KEY,
      },
    },
  );

  if (!res.ok) {
    throw new BadRequestError("Could not fetch voices");
  }

  const result = (await res.json()) as ElevenLabsVoices;
  return result;
};

export const getVoice = async (id: string) => {
  const res = await fetch(`https://api.elevenlabs.io/v1/voices/${id}`, {
    method: "GET",

    headers: {
      "xi-api-key": env.ELEVENLABS_API_KEY,
    },
  });

  if (!res.ok) {
    throw new BadRequestError("Could not fetch voice");
  }

  const result = (await res.json()) as ElevenLabsVoice;
  return result;
};

export type ElevenLabsVoice = {
  voice_id: string;
  name: string;
  category:
    | "premade"
    | "cloned"
    | "generated"
    | "professional"
    | "famous"
    | "high_quality";
  preview_url: string;
  description: string;
  labels: ElevenLabsVoiceLabel;
};

export type ElevenLabsVoiceLabel = {
  gender: "male" | "female" | "neutral";
  language: string;
};

export type ListVoiceSearchParams = {
  page_size?: number;
  category?: "premade" | "cloned" | "generated" | "professional";
};

export type ElevenLabsVoices = {
  voices: ElevenLabsVoice[];
};

const elevenLabsVoiceService = {
  listVoices,
  getVoice,
};

export default elevenLabsVoiceService;
