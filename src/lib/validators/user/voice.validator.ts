import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, nString } from "@/lib/utils/zod.utils";

export const voiceGetAllParamsValidator = z.object({
  ...baseGetParamsSchema,
  type: z.enum(["Default", "Cloned"]).optional(),
});

export const voiceReadDtoValidator = z.object({
  id: nString,
  userId: nString,
  userName: nString,
  type: nString,
  name: nString,
  description: nString,
  audioServiceType: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
