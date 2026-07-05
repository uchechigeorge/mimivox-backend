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

export const subscriptionChangePlanValidator = z.object({
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
  planId: nString,
  planName: nString,
  isActive: nBoolean,
  status: nString,
  startDate: nDate,
  nextBillingDate: nDate,
  endDate: nDate,
  initialAmount: nNumber,
  paymentToken: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
