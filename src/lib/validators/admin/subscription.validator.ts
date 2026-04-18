import { nDate, nString } from "@/lib/utils/zod.utils";
import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";

export const subscriptionListParamsValidator = z.object({
  ...baseGetParamsSchema,
  slug: z.string().optional(),
});

export const subscriptionGetParamsValidator = z.object({
  id: z.guid(),
});

export const subscriptionExtendParamsValidator = z.object({
  id: z.guid(),
});

export const subscriptionReadDtoValidator = z.object({
  id: nString,
  referenc3: nString,
  planId: nString,
  planName: nString,
  pricingId: nString,
  pricingName: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
