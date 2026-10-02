import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { dateRangeParamsSchema } from "../shared/date-range-params.validator";
import {
  nDate,
  nNumber,
  nString,
  stringToOptionalBoolean,
} from "@/lib/utils/zod.utils";

export const musicListParamsValidator = z.object({
  ...baseGetParamsSchema,
  ...dateRangeParamsSchema,
});

export const sunoMusicGetQueryValidator = z.object({
  ignoreUpdate: stringToOptionalBoolean,
  ignoreReversal: stringToOptionalBoolean,
});

export const musicGetParamsValidator = z.object({
  id: z.guid(),
});

export const musicReadDtoValidator = z.object({
  id: nString,
  audioUrl: nString,
  altAudioUrl: nString,
  imageUrl: nString,
  altImageUrl: nString,
  streamAudioUrl: nString,
  altStreamAudioUrl: nString,
  title: nString,
  prompt: nString,
  durationInSeconds: nNumber,
  musicServiceType: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
