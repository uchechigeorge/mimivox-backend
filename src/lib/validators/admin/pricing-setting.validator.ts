import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";
import {
  nBoolean,
  nDate,
  nNumber,
  nString,
  rNumber,
} from "@/lib/utils/zod.utils";

export const pricingSettingListParamsValidator = z.object({
  ...baseGetParamsSchema,
  pricingId: z.string().optional(),
});

export const pricingSettingGetParamsValidator = z.object({
  id: z.guid(),
});

export const pricingSettingReadDtoValidator = z.object({
  id: nString,
  pricingId: nString,
  pricingName: nString,
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
  updatedAt: nDate,
  createdAt: nDate,
});

export const pricingSettingUpdateParamsValidator = z.object({
  id: z.guid(),
});

export const pricingSettingUpdateDtoValidator = z.object({
  noOfCredits: rNumber,
  noOfWordsAllowed: rNumber,
  noOfPremiumVoices: rNumber,
  noOfCloneVoices: rNumber,
  noOfImages: rNumber,
  noOfMusic: rNumber,
  noOfVideos: rNumber,
  maxVideoDurationInSeconds: rNumber,
  hasCommunitySupport: z.boolean(),
  hasEmailSupport: z.boolean(),
  hasDedicatedCustomerSupport: z.boolean(),
  hasApiAccess: z.boolean(),
});
