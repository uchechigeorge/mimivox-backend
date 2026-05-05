import { $Enums, User, Voice } from "@/generated/prisma/client";
import { ResponseMeta } from "@/lib/dtos/shared/response-meta";

export type AudioListResponseMeta = ResponseMeta & {};

export type TTSValidateOptions = {
  userId: string;
  content: string;
  voiceId: string;
  audioServiceType: $Enums.AudioServiceType;
};

export type TTSReverseOptions = {
  userId: string;
  content: string;
  audioServiceType: $Enums.AudioServiceType;
};

export type TTSCreateAudioOptions = {
  user: User;
  content: string;
  voice: Voice;
  languageCode?: string;
  requestLog?: any;
  audioUrl: string;
};
