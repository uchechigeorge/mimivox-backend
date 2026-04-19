import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, normalizeOptional, nString } from "@/lib/utils/zod.utils";

export const voiceListParamsValidator = z.object({
  ...baseGetParamsSchema,
  type: normalizeOptional(z.enum(["Default", "Cloned"])),
});

export const voiceReadDtoValidator = z.object({
  id: nString,
  userId: nString,
  userName: nString,
  type: nString,
  name: nString,
  description: nString,
  gender: nString,
  audioServiceType: nString,
  audioServiceReferenceId: nString,
  previewUrl: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
