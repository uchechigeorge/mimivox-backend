import {
  GetSubscriptionByTokenParams,
  ReadSubscriptionDto,
} from "@/lib/dtos/user/subscription.dto";
import {
  GetMetaArgs,
  PaystackMetadata,
  PaystackPayload,
  ReadSubscriptionMetaDetailsDto,
} from "./types";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { NotFoundError, UnauthorizedError } from "@/lib/utils/error.util";
import { subscriptionReadValidator } from "@/lib/validators/user/subscription.validator";
import { UserAuthItems } from "@/lib/types";
import userRepo from "@/lib/repositories/user.repo";

export const getSubscriptionByPaymentToken = async (
  params: GetSubscriptionByTokenParams,
  authItems: UserAuthItems,
): Promise<[ReadSubscriptionDto, ReadSubscriptionMetaDetailsDto]> => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError();

  const [data, count] = await subscriptionRepo.query(
    {
      paymentToken: params.id,
      userId: authItems.userId,
    },
    { includeRelations: true },
  );
  if (count < 1) throw new NotFoundError();

  const dto = subscriptionReadValidator.parse(data[0]);

  const meta = getMeta({
    paymentToken: dto.paymentToken ?? "",
    email: user.email,
    amount: dto.pricing?.price ?? 0,
  });

  return [dto, meta];
};

export const getMeta = (args: GetMetaArgs) => {
  const { amount, email, paymentToken } = args;
  const paystackMetadata: PaystackMetadata = {
    type: "SubscriptionPayment",
    paymentToken,
  };

  const paystackPayload: PaystackPayload = {
    amount,
    email,
    channels: ["card"],
    metadata: paystackMetadata,
  };

  const meta: ReadSubscriptionMetaDetailsDto = {
    paystackPayload,
    paystackMetadata,
  };

  return meta;
};
