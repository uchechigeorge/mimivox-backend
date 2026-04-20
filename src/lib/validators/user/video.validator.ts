import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, nString } from "@/lib/utils/zod.utils";

export const videoListParamsValidator = z.object({
  ...baseGetParamsSchema,
});

export const videoGetParamsValidator = z.object({
  id: z.guid(),
});

export const videoReadDtoValidator = z.object({
  id: nString,
  url: nString,
  altUrl: nString,
  title: nString,
  prompt: nString,
  videoServiceType: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
