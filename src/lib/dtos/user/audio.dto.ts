import {
  audioListParamsValidator,
  audioReadDtoValidator,
} from "@/lib/validators/user/audio.validator";
import z from "zod";

export type AudioGetAllParams = z.infer<typeof audioListParamsValidator>;

export type AudioReadDto = z.infer<typeof audioReadDtoValidator>;
