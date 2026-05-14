import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import {
  nBoolean,
  nDate,
  nNumber,
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
  noOfCreditsUsed: nNumber,
  totalCreditsUsed: nNumber,
  noOfCreditsLeft: nNumber,
  noOfCreditsAllocated: nNumber,
  noOfWordsAllowed: nNumber,
  noOfCharactersUsed: nNumber,
  totalCharactersUsed: nNumber,
  noOfCharactersLeft: nNumber,
  noOfCharactersAllocated: nNumber,
  noOfCloneVoicesUsed: nNumber,
  totalCloneVoicesUsed: nNumber,
  noOfCloneVoicesLeft: nNumber,
  noOfCloneVoicesAllocated: nNumber,
  noOfPremiumVoicesUsed: nNumber,
  totalPremiumVoicesUsed: nNumber,
  noOfPremiumVoicesLeft: nNumber,
  noOfPremiumVoicesAllocated: nNumber,
  noOfImagesUsed: nNumber,
  totalImagesUsed: nNumber,
  noOfImagesLeft: nNumber,
  noOfImagesAllocated: nNumber,
  noOfMusicsUsed: nNumber,
  totalMusicsUsed: nNumber,
  noOfMusicsLeft: nNumber,
  noOfMusicsAllocated: nNumber,
  noOfVideosUsed: nNumber,
  totalVideosUsed: nNumber,
  noOfVideosLeft: nNumber,
  noOfVideosAllocated: nNumber,
  subscription: z
    .object({
      isActive: nBoolean,
      nextBillingDate: nDate,
      status: nString,
      planName: nString,
    })
    .nullish(),
  updatedAt: nDate,
  createdAt: nDate,
});
