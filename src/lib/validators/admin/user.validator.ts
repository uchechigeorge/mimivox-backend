import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import {
  nBoolean,
  nDate,
  nString,
  stringToNullableDate,
  stringToOptionalBoolean,
} from "@/lib/utils/zod.utils";

export const userListParamsValidator = z.object({
  ...baseGetParamsSchema,
  blocked: stringToOptionalBoolean,
});

export const userGetParamsValidator = z.object({
  id: z.guid(),
});

export const updateUserSubscriptionParamsValidator = z.object({
  id: z.string().min(1),
});

export const updateUserSubscriptionDtoValidator = z.object({
  isActive: z.boolean(),
  pricingId: z.guid().nullish(),
  amount: z.number().min(0).optional(),
  startDate: stringToNullableDate,
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
      planName: nString,
    })
    .nullish(),
  dateModified: nDate,
  dateCreated: nDate,
});
