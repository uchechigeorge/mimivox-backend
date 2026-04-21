import {
  voiceGetParamsValidator,
  voiceListParamsValidator,
  voiceReadDtoValidator,
} from "@/lib/validators/admin/voice.validator";
import z from "zod";

export type VoiceListParams = z.infer<typeof voiceListParamsValidator>;
export type VoiceGetParams = z.infer<typeof voiceGetParamsValidator>;

export type VoiceReadDto = z.infer<typeof voiceReadDtoValidator>;
