import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, nNumber, nString } from "@/lib/utils/zod.utils";

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
  durationInSeconds: nNumber,
  videoServiceType: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
