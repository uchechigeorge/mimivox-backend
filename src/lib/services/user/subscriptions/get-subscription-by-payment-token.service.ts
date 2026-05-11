import {
  GetSubscriptionByTokenParams,
  ReadSubscriptionDto,
} from "@/lib/dtos/user/subscription.dto";
import { ReadSubscriptionMetaDetailsDto } from "./types";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { NotFoundError } from "@/lib/utils/error.util";
import { subscriptionReadValidator } from "@/lib/validators/user/subscription.validator";
import { UserAuthItems } from "@/lib/types";

export const getSubscriptionByPaymentToken = async (
  params: GetSubscriptionByTokenParams,
  authItems: UserAuthItems,
): Promise<[ReadSubscriptionDto, ReadSubscriptionMetaDetailsDto]> => {
  const [data, count] = await subscriptionRepo.query(
    {
      paymentToken: params.id,
      userId: authItems.userId,
    },
    { includeRelations: true },
  );
  if (count < 1) throw new NotFoundError();

  const dto = subscriptionReadValidator.parse(data[0]);

  const meta: ReadSubscriptionMetaDetailsDto = {
    paystackMetadata: {
      type: "SubscriptionPayment",
      paymentToken: dto.paymentToken ?? "",
    },
  };

  return [dto, meta];
};
