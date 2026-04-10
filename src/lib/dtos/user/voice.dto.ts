import {
  voiceGetAllParamsValidator,
  voiceReadDtoValidator,
} from "@/lib/validators/user/voice.validator";
import z from "zod";

export type VoiceGetAllParams = z.infer<typeof voiceGetAllParamsValidator>;

export type VoiceReadDto = z.infer<typeof voiceReadDtoValidator>;
