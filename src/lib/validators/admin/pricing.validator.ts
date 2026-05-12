import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nBoolean, nDate, nNumber, nString } from "@/lib/utils/zod.utils";

export const pricingListParamsValidator = z.object({
  ...baseGetParamsSchema,
  slug: z.string().optional(),
});

export const pricingGetParamsValidator = z.object({
  id: z.guid(),
});

export const pricingReadDtoValidator = z.object({
  id: nString,
  name: nString,
  slug: nString,
  price: nNumber,
  oldPrice: nNumber,
  description: nString,
  isFree: nBoolean,
  plan: z
    .object({
      id: nString,
      name: nString,
      slug: nString,
    })
    .optional(),
  updatedAt: nDate,
  createdAt: nDate,
});

export const pricingUpdateParamsValidator = z.object({
  id: z.guid(),
});

export const pricingUpdateDtoValidator = z.object({
  price: z.number().min(0),
  oldPrice: z.number().min(0).nullish(),
});
