import { nBoolean, nDate, nNumber, nString } from "@/lib/utils/zod.utils";
import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";

export const subscriptionPaymentListParamsValidator = z.object({
  ...baseGetParamsSchema,
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
  updatedAt: nDate,
  createdAt: nDate,
});
