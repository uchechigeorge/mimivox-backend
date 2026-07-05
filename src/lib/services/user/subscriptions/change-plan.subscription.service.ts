import { prisma } from "@/lib/db/prisma";
import {
  ChangePlanSubscriptionDto,
  ReadSubscriptionDto,
} from "@/lib/dtos/user/subscription.dto";
import planRepo from "@/lib/repositories/plan.repo";
import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import { UserAuthItems } from "@/lib/types";
import { getNextBillingDate } from "@/lib/utils/date.utils";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { toAppIntervalType } from "../../shared/pricings/pricing-helper.service";
import { getMeta } from "./get-subscription-by-payment-token.service";
import { ReadSubscriptionMetaDetailsDto } from "./types";
import { subscriptionReadValidator } from "@/lib/validators/user/subscription.validator";
import { Subscription } from "@/generated/prisma/client";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";
import paystackService from "../../shared/paystack";
import { PaystackSubscription } from "../../shared/paystack/subscriptions/types";

export const changePlan = async (
  body: ChangePlanSubscriptionDto,
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

  const activeSubscription =
    await subscriptionRepo.getByUserIdAndIsActive(userId);
  if (!activeSubscription) {
    throw new BadRequestError("User does not have an active subscription");
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

  const currentPlan = await planRepo.getById(activeSubscription.planId);
  if (!currentPlan) {
    throw new BadRequestError("Current subscription plan not found");
  }

  if (currentPlan.id === plan.id) {
    throw new BadRequestError("Cannot change to the same subscription plan");
  }

  const isDowngrade = plan.sequence < currentPlan.sequence;
  let paymentToken = "";
  let startDate: Date = new Date();
  let nextBillingDate = getNextBillingDate(
    startDate,
    toAppIntervalType(pricing.intervalType),
    pricing.intervalCount,
  );

  if (!isDowngrade) {
    startDate = activeSubscription.nextBillingDate ?? new Date();

    nextBillingDate = getNextBillingDate(
      startDate,
      toAppIntervalType(pricing.intervalType),
      pricing.intervalCount,
    );
  }

  let newSubscription: Subscription | null = null;

  await prisma.$transaction(async (tx) => {
    newSubscription = await subscriptionRepo.create(
      {
        userId,
        userName: user.fullName,
        pricingId: pricing.id,
        pricingName: pricing.name,
        planId: plan.id,
        planName: plan.name,
        status: "Pending",
        startDate,
        nextBillingDate,
        initialAmount: body.amount,
        previousSubscriptionId: activeSubscription.id,
        isDowngrade,
      },
      tx,
    );
    paymentToken = newSubscription.paymentToken;
  });

  const meta = getMeta({
    paymentToken,
    email: user.email,
    amount: pricing.price.toNumber(),
  });

  const readDto = subscriptionReadValidator.parse(newSubscription);
  return [readDto, meta];
};
