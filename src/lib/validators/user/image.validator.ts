import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, nString } from "@/lib/utils/zod.utils";

export const imageListParamsValidator = z.object({
  ...baseGetParamsSchema,
});

export const imageGetParamsValidator = z.object({
  id: z.guid(),
});

export const imageReadDtoValidator = z.object({
  id: nString,
  url: nString,
  altUrl: nString,
  title: nString,
  prompt: nString,
  imageServiceType: nString,
  languageCode: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
