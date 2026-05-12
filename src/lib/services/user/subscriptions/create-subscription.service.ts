import {
  CreateSubscriptionDto,
  ReadSubscriptionDto,
} from "@/lib/dtos/user/subscription.dto";
import { UserAuthItems } from "@/lib/types";
import { ReadSubscriptionMetaDetailsDto } from "./types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import pricingRepo from "@/lib/repositories/pricing.repo";
import { getNextBillingDate } from "@/lib/utils/date.utils";
import { toAppIntervalType } from "../../shared/pricings/pricing-helper.service";
import { subscriptionReadValidator } from "@/lib/validators/user/subscription.validator";
import { prisma } from "@/lib/db/prisma";
import userRepo from "@/lib/repositories/user.repo";
import planRepo from "@/lib/repositories/plan.repo";
import { getMeta } from "./get-subscription-by-payment-token.service";

export const createSubscription = async (
  body: CreateSubscriptionDto,
  authItems: UserAuthItems,
): Promise<[ReadSubscriptionDto, ReadSubscriptionMetaDetailsDto]> => {
  const userId = authItems.userId;
  if (!userId) {
    throw new UnauthorizedError();
  }
  const user = await userRepo.getById(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  const hasActiveSubscription =
    await subscriptionRepo.getExistsByUserIdAndIsActive(userId);
  if (hasActiveSubscription) {
    throw new BadRequestError("User already has an active subscription");
  }

  const pricing = await pricingRepo.getById(body.pricingId);
  if (!pricing) {
    throw new BadRequestError("Invalid subscription pricing");
  }

  const plan = await planRepo.getById(pricing.planId);
  if (!plan || plan.isFree) {
    throw new BadRequestError("Invalid subscription plan");
  }

  if (body.amount < pricing.price.toNumber()) {
    throw new BadRequestError("Invalid subscription amount");
  }

  let paymentToken = "";
  const startDate = new Date();
  const nextBillingDate = getNextBillingDate(
    startDate,
    toAppIntervalType(pricing.intervalType),
    pricing.intervalCount,
  );

  let subscription = await subscriptionRepo.getByUserIdAndStatus(
    userId,
    "Pending",
  );

  await prisma.$transaction(async (tx) => {
    if (subscription) {
      const updated = await subscriptionRepo.update(
        subscription.id,
        {
          userId,
          userName: user.fullName,
          pricingId: pricing.id,
          pricingName: pricing.name,
          status: "Pending",
          startDate,
          nextBillingDate,
          planId: pricing.planId,
          planName: pricing.planName,
          initialAmount: body.amount,
        },
        tx,
      );

      paymentToken = updated.paymentToken;
    } else {
      const inserted = await subscriptionRepo.create(
        {
          userId,
          userName: user.fullName,
          pricingId: pricing.id,
          pricingName: pricing.name,
          status: "Pending",
          startDate,
          nextBillingDate,
          planId: pricing.planId,
          planName: pricing.planName,
          initialAmount: body.amount,
        },
        tx,
      );
      paymentToken = inserted.paymentToken;
      subscription = inserted;
    }
  });

  const meta = getMeta({
    paymentToken,
    email: user.email,
    amount: pricing.price.toNumber(),
  });

  const readDto = subscriptionReadValidator.parse(subscription);
  return [readDto, meta];
};
