import {
  audioGetAllParamsValidator,
  audioReadDtoValidator,
} from "@/lib/validators/user/audio.validator";
import z from "zod";

export type AudioGetAllParams = z.infer<typeof audioGetAllParamsValidator>;

export type AudioReadDto = z.infer<typeof audioReadDtoValidator>;
