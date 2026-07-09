import { nBoolean, nDate, nNumber, nString } from "@/lib/utils/zod.utils";
import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";

export const subscriptionPaymentListParamsValidator = z.object({
  ...baseGetParamsSchema,
  slug: z.string().optional(),
  subscriptionId: z.string().optional(),
});

export const subscriptionPaymentGetParamsValidator = z.object({
  id: z.guid(),
});

export const subscriptionPaymentReadDtoValidator = z.object({
  id: nString,
  userId: nString,
  userName: nString,
  subscriptionId: nString,
  subscriptionReference: nString,
  amount: nNumber,
  isInitialPayment: nBoolean,
  isPaymentVerified: nBoolean,
  paymentGateway: nString,
  paidAt: nDate,
  status: nString,
  updatedAt: nDate,
  createdAt: nDate,
});
