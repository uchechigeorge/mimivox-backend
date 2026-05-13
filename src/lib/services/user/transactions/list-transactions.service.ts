import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import { ListTransactionsMetaResponse } from "./types";
import {
  TransactionListParams,
  TransactionReadDto,
} from "@/lib/dtos/user/transaction.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { transactionReadDtoValidator } from "@/lib/validators/user/transaction.validator";
import { UserAuthItems } from "@/lib/types";

export const listTransactions = async (
  params: TransactionListParams,
  authItems: UserAuthItems,
): Promise<[TransactionReadDto[], ListTransactionsMetaResponse]> => {
  const [data, total] = await subscriptionPaymentRepo.query({
    ...params,
    userId: authItems.userId,
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
