import {
  SubscriptionPaymentGetParams,
  SubscriptionPaymentReadDto,
} from "@/lib/dtos/admin/subscription-payment.dto";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import { NotFoundError } from "@/lib/utils/error.util";
import { subscriptionPaymentReadDtoValidator } from "@/lib/validators/admin/subscription-payment.validator";

export const getSubscriptionPayment = async (
  params: SubscriptionPaymentGetParams,
): Promise<SubscriptionPaymentReadDto> => {
  const [data, total] = await subscriptionPaymentRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = subscriptionPaymentReadDtoValidator.parse(data[0]);

  return dto;
};
