import {
  nBoolean,
  nDate,
  nNumber,
  nString,
  rNumber,
  rString,
} from "@/lib/utils/zod.utils";
import { z } from "zod";

export const subscriptionCreateValidator = z.object({
  pricingId: rString,
  amount: rNumber,
});

export const subscriptionGetByPaymentTokenParamsValidator = z.object({
  id: z.string(),
});

export const subscriptionReadValidator = z.object({
  id: nString,
  pricingId: nString,
  pricingName: nString,
  isActive: nBoolean,
  status: nString,
  startDate: nDate,
  initialAmount: nNumber,
  paymentToken: nString,
  pricing: z
    .object({
      id: nString,
      name: nString,
      planName: nString,
      price: nNumber,
      oldPrice: nNumber,
    })
    .optional(),
  updatedAt: nDate,
  createdAt: nDate,
});
