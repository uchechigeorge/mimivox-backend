import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { ListSubscriptionsMetaResponse } from "./types";
import {
  SubscriptionListParams,
  SubscriptionReadDto,
} from "@/lib/dtos/admin/subscription.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { subscriptionReadDtoValidator } from "@/lib/validators/admin/subscription.validator";

export const listSubscriptions = async (
  params: SubscriptionListParams,
): Promise<[SubscriptionReadDto[], ListSubscriptionsMetaResponse]> => {
  const [data, total] = await subscriptionRepo.query(
    {
      ...params,
    },
    { includeRelations: true },
  );

  const dto: SubscriptionReadDto[] = await parseArr(
    data,
    subscriptionReadDtoValidator,
  );

  const meta: ListSubscriptionsMetaResponse = {
    total,
  };

  return [dto, meta];
};
