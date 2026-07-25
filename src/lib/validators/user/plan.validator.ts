import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import { nBoolean, nDate, nNumber, nString } from "@/lib/utils/zod.utils";

export const planListParamsValidator = z.object({
  ...baseGetParamsSchema,
  slug: z.string().optional(),
});

export const planGetParamsValidator = z.object({
  id: z.guid(),
});

export const planReadDtoValidator = z.object({
  id: nString,
  name: nString,
  slug: nString,
  description: nString,
  isFree: nBoolean,
  pricings: z
    .object({
      id: nString,
      name: nString,
      slug: nString,
      price: nNumber,
      oldPrice: nNumber,
      isFree: nBoolean,
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
    })
    .array()
    .optional(),
  settings: z
    .object({
      id: nString,
      noOfCredits: nNumber,
      noOfPremiumVoices: nNumber,
      noOfCloneVoices: nNumber,
      noOfImages: nNumber,
      noOfMusic: nNumber,
      noOfVideos: nNumber,
      maxVideoDurationInSeconds: nNumber,
    })
    .optional(),
  updatedAt: nDate,
  createdAt: nDate,
});
