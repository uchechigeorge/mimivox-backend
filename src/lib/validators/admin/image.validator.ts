import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, nString } from "@/lib/utils/zod.utils";

export const imageListParamsValidator = z.object({
  ...baseGetParamsSchema,
  userId: z.string().optional(),
});

export const imageGetParamsValidator = z.object({
  id: z.guid(),
});

export const imageReadDtoValidator = z.object({
  id: nString,
  userId: nString,
  userName: nString,
  url: nString,
  altUrl: nString,
  title: nString,
  prompt: nString,
  imageServiceType: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
