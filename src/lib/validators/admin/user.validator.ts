import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import {
  nBoolean,
  nDate,
  nString,
  stringToNullableBoolean,
} from "@/lib/utils/zod.utils";

export const userGetAllParamsValidator = z.object({
  ...baseGetParamsSchema,
  blocked: stringToNullableBoolean,
});

export const updateUserSubscriptionParamsValidator = z.object({
  id: z.string().min(1),
});

export const updateUserSubscriptionDtoValidator = z.object({
  isActive: z.boolean(),
  pricingId: z.string().min(1),
  amount: z.number().min(0).optional(),
  startDate: z.date().optional(),
});

export const userReadDtoValidator = z.object({
  id: nString,
  email: nString,
  emailVerified: nBoolean,
  firstName: nString,
  lastName: nString,
  fullName: nString,
  dpUrl: nString,
  hasActiveSubscription: nBoolean,
  subscription: z
    .object({
      isActive: nBoolean,
      nextBillingDate: nDate,
      status: nString,
    })
    .nullish(),
  dateModified: nDate,
  dateCreated: nDate,
});
