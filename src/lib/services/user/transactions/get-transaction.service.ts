import {
  TransactionGetParams,
  TransactionReadDto,
} from "@/lib/dtos/user/transaction.dto";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { transactionReadDtoValidator } from "@/lib/validators/user/transaction.validator";

export const getTransaction = async (
  params: TransactionGetParams,
  authItems: UserAuthItems,
): Promise<TransactionReadDto> => {
  const [data, total] = await subscriptionPaymentRepo.query(
    {
      id: params.id,
      userId: authItems.userId,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = transactionReadDtoValidator.parse(data[0]);

  return dto;
};
