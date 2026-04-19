import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, normalizeOptional, nString } from "@/lib/utils/zod.utils";

export const taskListParamsValidator = z.object({
  ...baseGetParamsSchema,
  type: normalizeOptional(z.enum(["None", "Music", "Video"])),
  status: normalizeOptional(z.enum(["Pending", "Started", "Completed"])),
  serviceOption: normalizeOptional(z.enum(["None", "Suno", "Xai"])),
});

export const taskGetParamsValidator = z.object({
  id: z.guid(),
});

export const taskReadDtoValidator = z.object({
  id: nString,
  userId: nString,
  userName: nString,
  type: nString,
  status: nString,
  serviceOption: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
