import { env } from "@/lib/config/env";
import { BadRequestError } from "@/lib/utils/error.util";

export const listVoices = async (searchParams?: ListVoiceSearchParams) => {
  const queryString = buildQuery(searchParams);
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

function buildQuery(params?: Record<string, any>) {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

const elevenLabsVoiceService = {
  listVoices,
  getVoice,
};

export default elevenLabsVoiceService;
