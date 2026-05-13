import {
  transactionGetParamsValidator,
  transactionListParamsValidator,
  transactionReadDtoValidator,
} from "@/lib/validators/admin/transaction.validator";
import z from "zod";

export type TransactionListParams = z.infer<
  typeof transactionListParamsValidator
>;

export type TransactionGetParams = z.infer<
  typeof transactionGetParamsValidator
>;

export type TransactionReadDto = z.infer<typeof transactionReadDtoValidator>;
