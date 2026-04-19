import {
  imageGetParamsValidator,
  imageListParamsValidator,
  imageReadDtoValidator,
} from "@/lib/validators/user/image.validator";
import z from "zod";

export type ImageListParams = z.infer<typeof imageListParamsValidator>;
export type ImageGetParams = z.infer<typeof imageGetParamsValidator>;

export type ImageReadDto = z.infer<typeof imageReadDtoValidator>;
