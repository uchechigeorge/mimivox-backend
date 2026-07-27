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
  planId: nString,
  planName: nString,
  plan: z
    .object({
      id: nString,
      name: nString,
      slug: nString,
    })
    .optional(),
  settings: z
    .object({
      id: nString,
      noOfCredits: nNumber,
      noOfWordsAllowed: nNumber,
      noOfPremiumVoices: nNumber,
      noOfCloneVoices: nNumber,
      noOfImages: nNumber,
      noOfMusic: nNumber,
      noOfVideos: nNumber,
      maxVideoDurationInSeconds: nNumber,
      hasCommunitySupport: nBoolean,
      hasEmailSupport: nBoolean,
      hasDedicatedCustomerSupport: nBoolean,
      hasApiAccess: nBoolean,
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
