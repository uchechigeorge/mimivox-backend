import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import { ListSubscriptionPaymentsMetaResponse } from "./types";
import {
  SubscriptionPaymentListParams,
  SubscriptionPaymentReadDto,
} from "@/lib/dtos/admin/subscription-payment.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { subscriptionPaymentReadDtoValidator } from "@/lib/validators/admin/subscription-payment.validator";
import { UserAuthItems } from "@/lib/types";

export const listSubscriptionPayments = async (
  params: SubscriptionPaymentListParams,
  authItems: UserAuthItems,
): Promise<
  [SubscriptionPaymentReadDto[], ListSubscriptionPaymentsMetaResponse]
> => {
  const [data, total] = await subscriptionPaymentRepo.query({
    ...params,
    userId: authItems.userId,
  });

  const dto: SubscriptionPaymentReadDto[] = await parseArr(
    data,
    subscriptionPaymentReadDtoValidator,
  );

  const meta: ListSubscriptionPaymentsMetaResponse = {
    total,
  };

  return [dto, meta];
};
