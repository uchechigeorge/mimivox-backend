import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import { ListTransactionsMetaResponse } from "./types";
import {
  TransactionListParams,
  TransactionReadDto,
} from "@/lib/dtos/admin/transaction.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { transactionReadDtoValidator } from "@/lib/validators/admin/transaction.validator";

export const listTransactions = async (
  params: TransactionListParams,
): Promise<[TransactionReadDto[], ListTransactionsMetaResponse]> => {
  const [data, total] = await subscriptionPaymentRepo.query({
    ...params,
  });

  const dto: TransactionReadDto[] = await parseArr(
    data,
    transactionReadDtoValidator,
  );

  const meta: ListTransactionsMetaResponse = {
    total,
  };

  return [dto, meta];
};
