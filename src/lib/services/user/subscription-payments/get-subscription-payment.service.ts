import {
  SubscriptionPaymentGetParams,
  SubscriptionPaymentReadDto,
} from "@/lib/dtos/user/subscription-payment.dto";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { subscriptionPaymentReadDtoValidator } from "@/lib/validators/user/subscription-payment.validator";

export const getSubscriptionPayment = async (
  params: SubscriptionPaymentGetParams,
  authItems: UserAuthItems,
): Promise<SubscriptionPaymentReadDto> => {
  const [data, total] = await subscriptionPaymentRepo.query(
    {
      id: params.id,
      userId: authItems.userId,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = subscriptionPaymentReadDtoValidator.parse(data[0]);

  return dto;
};
