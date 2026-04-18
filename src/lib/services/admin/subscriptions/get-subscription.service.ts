import {
  SubscriptionGetParams,
  SubscriptionReadDto,
} from "@/lib/dtos/admin/subscription.dto";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { NotFoundError } from "@/lib/utils/error.util";
import { subscriptionReadDtoValidator } from "@/lib/validators/admin/subscription.validator";

export const getSubscription = async (
  params: SubscriptionGetParams,
): Promise<SubscriptionReadDto> => {
  const [data, total] = await subscriptionRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await subscriptionReadDtoValidator.parseAsync(data[0]);

  return dto;
};
