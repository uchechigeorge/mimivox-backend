import {
  videoGetParamsValidator,
  videoListParamsValidator,
  videoReadDtoValidator,
} from "@/lib/validators/user/video.validator";
import z from "zod";

export type VideoListParams = z.infer<typeof videoListParamsValidator>;
export type VideoGetParams = z.infer<typeof videoGetParamsValidator>;

export type VideoReadDto = z.infer<typeof videoReadDtoValidator>;
