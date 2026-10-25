import { GetCreditPurchaseByTokenParams } from "@/lib/dtos/user/credit.dto";
import creditPurchaseRepo from "@/lib/repositories/credit-purchase.repo";
import userRepo from "@/lib/repositories/user.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError, UnauthorizedError } from "@/lib/utils/error.util";
import { parseArr } from "@/lib/utils/zod.utils";
import { creditPurchaseReadValidator } from "@/lib/validators/user/credit.validator";
import {
  PaystackMetadata,
  PaystackPayload,
  ReadSubscriptionMetaDetailsDto,
} from "../subscriptions/types";

type GetMetaArgs = {
  paymentToken: string;
  email: string;
  amount: number;
};

export const getCreditPurchaseMeta = (args: GetMetaArgs) => {
  const { amount, email, paymentToken } = args;
  const paystackMetadata: PaystackMetadata = {
    type: "OneTimePayment",
    paymentToken,
  };

  const paystackPayload: PaystackPayload = {
    // Paystack expects the lowest currency unit
    amount: amount * 100,
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

export const getCreditPurchaseByPaymentToken = async (
  params: GetCreditPurchaseByTokenParams,
  authItems: UserAuthItems,
) => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError();

  const purchase = await creditPurchaseRepo.getByPaymentToken(params.id);
  if (!purchase || purchase.userId !== userId) throw new NotFoundError();

  const meta = getCreditPurchaseMeta({
    paymentToken: purchase.paymentToken,
    email: user.email,
    amount: purchase.amount.toNumber(),
  });

  return [creditPurchaseReadValidator.parse(purchase), meta] as const;
};

export const listCreditPurchases = async (authItems: UserAuthItems) => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const data = await creditPurchaseRepo.listByUserId(userId);

  return await parseArr(data, creditPurchaseReadValidator);
};
