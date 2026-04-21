import {
  audioGetParamsValidator,
  audioListParamsValidator,
  audioReadDtoValidator,
} from "@/lib/validators/user/audio.validator";
import z from "zod";

export type AudioListParams = z.infer<typeof audioListParamsValidator>;
export type AudioGetParams = z.infer<typeof audioGetParamsValidator>;

export type AudioReadDto = z.infer<typeof audioReadDtoValidator>;
