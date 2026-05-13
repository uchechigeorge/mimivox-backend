import {
  TransactionGetParams,
  TransactionReadDto,
} from "@/lib/dtos/admin/transaction.dto";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import { NotFoundError } from "@/lib/utils/error.util";
import { transactionReadDtoValidator } from "@/lib/validators/admin/transaction.validator";

export const getTransaction = async (
  params: TransactionGetParams,
): Promise<TransactionReadDto> => {
  const [data, total] = await subscriptionPaymentRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = transactionReadDtoValidator.parse(data[0]);

  return dto;
};
