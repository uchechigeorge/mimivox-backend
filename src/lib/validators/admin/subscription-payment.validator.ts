import { nBoolean, nDate, nNumber, nString } from "@/lib/utils/zod.utils";
import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";

export const subscriptionPaymentListParamsValidator = z.object({
  ...baseGetParamsSchema,
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
  status: nString,
  planId: nString,
  planName: nString,
  startDate: nDate,
  endDate: nDate,
  paidAt: nDate,
  isCurrent: nBoolean,
  updatedAt: nDate,
  createdAt: nDate,
});
