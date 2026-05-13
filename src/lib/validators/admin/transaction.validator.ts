import { nDate, nNumber, nString } from "@/lib/utils/zod.utils";
import z from "zod";
import { baseGetParamsSchema } from "../shared/base-get-params.validator";

export const transactionListParamsValidator = z.object({
  ...baseGetParamsSchema,
  userId: z.string().optional(),
});

export const transactionGetParamsValidator = z.object({
  id: z.guid(),
});

export const transactionReadDtoValidator = z.object({
  id: nString,
  userId: nString,
  userName: nString,
  amount: nNumber,
  type: nString.default("SubscriptionPayment"),
  updatedAt: nDate,
  createdAt: nDate,
});
