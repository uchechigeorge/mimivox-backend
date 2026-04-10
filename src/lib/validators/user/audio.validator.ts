import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, nString, oString } from "@/lib/utils/zod.utils";

export const audioGetAllParamsValidator = z.object({
  ...baseGetParamsSchema,
  type: nString,
});

export const audioReadDtoValidator = z.object({
  id: nString,
  userId: nString,
  userName: nString,
  content: nString,
  voiceId: nString,
  voiceName: nString,
  audioUrl: nString,
  audioServiceType: nString,
  languageCode: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
