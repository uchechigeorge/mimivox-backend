import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, normalizeOptional, nString } from "@/lib/utils/zod.utils";

export const taskListParamsValidator = z.object({
  ...baseGetParamsSchema,
  type: normalizeOptional(z.enum(["None", "Music", "Video", "Image"])),
  status: normalizeOptional(z.enum(["Pending", "Started", "Completed", "Failed"])),
  serviceOption: normalizeOptional(z.enum(["None", "Suno", "Xai", "Runway"])),
});

export const taskGetParamsValidator = z.object({
  id: z.guid(),
});

export const taskReadDtoValidator = z.object({
  id: nString,
  type: nString,
  status: nString,
  serviceOption: nString,
  referenceId: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
