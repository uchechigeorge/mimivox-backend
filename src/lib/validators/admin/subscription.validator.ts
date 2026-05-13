import { nBoolean, nDate, nNumber, nString } from "@/lib/utils/zod.utils";
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
  planId: nString,
  planName: nString,
  pricingId: nString,
  pricingName: nString,
  userId: nString,
  userName: nString,
  reference: nString,
  paymentToken: nString,
  status: nString,
  isActive: nBoolean,
  startDate: nDate,
  nextBillingDate: nDate,
  endDate: nDate,
  initialAmount: nNumber,
  user: z
    .object({
      id: nString,
      firstName: nString,
      lastName: nString,
      fullName: nString,
      email: nString,
    })
    .optional(),
  updatedAt: nDate,
  createdAt: nDate,
});
