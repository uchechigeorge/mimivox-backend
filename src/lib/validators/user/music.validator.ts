import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nDate, nString } from "@/lib/utils/zod.utils";

export const musicListParamsValidator = z.object({
  ...baseGetParamsSchema,
});

export const musicGetParamsValidator = z.object({
  id: z.guid(),
});

export const musicReadDtoValidator = z.object({
  id: nString,
  url: nString,
  title: nString,
  prompt: nString,
  musicServiceType: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
