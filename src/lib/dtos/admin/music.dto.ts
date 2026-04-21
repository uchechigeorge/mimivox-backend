import {
  musicGetParamsValidator,
  musicListParamsValidator,
  musicReadDtoValidator,
} from "@/lib/validators/admin/music.validator";
import z from "zod";

export type MusicListParams = z.infer<typeof musicListParamsValidator>;
export type MusicGetParams = z.infer<typeof musicGetParamsValidator>;

export type MusicReadDto = z.infer<typeof musicReadDtoValidator>;
