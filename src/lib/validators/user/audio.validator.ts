import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, nString } from "@/lib/utils/zod.utils";

export const audioListParamsValidator = z.object({
  ...baseGetParamsSchema,
  type: nString,
});

export const audioGetParamsValidator = z.object({
  id: z.guid(),
});

export const audioReadDtoValidator = z.object({
  id: nString,
  content: nString,
  voiceId: nString,
  voiceName: nString,
  audioUrl: nString,
  audioServiceType: nString,
  languageCode: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
