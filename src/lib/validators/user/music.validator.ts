import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, nNumber, nString } from "@/lib/utils/zod.utils";

export const musicListParamsValidator = z.object({
  ...baseGetParamsSchema,
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
