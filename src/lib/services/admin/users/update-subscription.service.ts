import { PlanSetting, Pricing } from "@/generated/prisma/client";
import {
  UpdateUserSubscriptionDto,
  UpdateUserSubscriptionParams,
} from "@/lib/dtos/admin/user.dto";
import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import { getNextBillingDate } from "@/lib/utils/date.utils";
import { BadRequestError } from "@/lib/utils/error.util";
import { toAppIntervalType } from "../../shared/pricings/pricing-helper.service";
import { Decimal } from "@prisma/client/runtime/client";
import planSettingRepo from "@/lib/repositories/plan-setting.repo";
import planRepo from "@/lib/repositories/plan.repo";
import { prisma } from "@/lib/db/prisma";
import sharedSubscriptionService from "../../shared/subscriptions";
import { UserUpdateArgs } from "@/generated/prisma/models";

export const updateUserSubscription = async (
  params: UpdateUserSubscriptionParams,
  updateDto: UpdateUserSubscriptionDto,
) => {
  // ======================
  // 1. Fetch base data
  // ======================
  const user = await userRepo.getById(params.id);
  if (!user) {
    throw new BadRequestError("User not found");
  }

  let pricing: Pricing | null = null;
  let planSettings: PlanSetting | null = null;

  if (updateDto.pricingId) {
    pricing = await pricingRepo.getById(updateDto.pricingId);
    if (!pricing) {
      throw new BadRequestError("Pricing not found");
    }

    planSettings = await planSettingRepo.getByPlanId(pricing.planId);
    if (!planSettings) {
      throw new BadRequestError("Plan settings not found");
    }
  }

  if (updateDto.isActive && !pricing) {
    throw new BadRequestError(
      "Pricing plan must be provided for active subscriptions",
    );
  }

  const startDate = updateDto.startDate ?? new Date();

  // ======================
  // 2. Pre-fetch state
  // ======================
  const activeSubscription = await subscriptionRepo.getByUserIdAndIsActive(
    user.id,
    true,
  );

  const initialAmount = Decimal(
    updateDto.amount ? updateDto.amount : (pricing?.price.toNumber() ?? 0),
  );

  const shouldCreate = !activeSubscription && updateDto.isActive && pricing;
  let reference: string = "";
  if (shouldCreate) {
    // Generate reference
    reference = await sharedSubscriptionService.generateReference();
  }

  // ======================
  // 3. Build transaction
  // ======================
  const queries: any[] = [];

  // ======================
  // CASE 1: Activate new subscription
  // ======================
  if (!activeSubscription && updateDto.isActive && pricing) {
    queries.push(
      prisma.subscription.create({
        data: {
          isActive: true,
          userId: user.id,
          userName: user.fullName,
          planId: pricing.planId,
          planName: pricing.planName,
          pricingId: pricing.id,
          pricingName: pricing.name,
          startDate,
          nextBillingDate: getNextBillingDate(
            startDate,
            toAppIntervalType(pricing.intervalType),
            pricing.intervalCount,
          ),
          status: "WillRenew",
          initialAmount,
          paymentGateway: "Manual",
          reference: reference!,
        },
      }),
    );

    queries.push(
      prisma.user.update({
        where: { id: user.id },
        data: {
          ...getUserSettings(planSettings),
          hasActiveSubscription: true,
        },
      }),
    );
  }

  // ======================
  // CASE 2: Existing subscription
  // ======================
  if (activeSubscription) {
    // ----------------------
    // Cancel subscription
    // ----------------------
    if (updateDto.isActive === false) {
      queries.push(
        prisma.subscription.update({
          where: { id: activeSubscription.id },
          data: {
            isActive: false,
            status: "Completed",
            endDate: new Date(),
          },
        }),
      );

      const freePlan = await planRepo.getByIsFree();
      let freePlanSettings: PlanSetting | null = null;

      if (freePlan) {
        freePlanSettings = await planSettingRepo.getByPlanId(freePlan.id);
      }

      queries.push(
        prisma.user.update({
          where: { id: user.id },
          data: {
            ...getUserSettings(freePlanSettings),
            hasActiveSubscription: false,
          },
        }),
      );
    }

    // ----------------------
    // Change plan
    // ----------------------
    else if (pricing) {
      queries.push(
        prisma.subscription.update({
          where: { id: activeSubscription.id },
          data: {
            planId: pricing.planId,
            planName: pricing.planName,
            pricingId: pricing.id,
            pricingName: pricing.name,
            startDate,
            nextBillingDate: getNextBillingDate(
              startDate,
              toAppIntervalType(pricing.intervalType),
              pricing.intervalCount,
            ),
            initialAmount,
          },
        }),
      );

      queries.push(
        prisma.user.update({
          where: { id: user.id },
          data: {
            ...getUserSettings(planSettings),
            hasActiveSubscription: true,
          },
        }),
      );
    }
  }

  // ======================
  // 4. Execute transaction
  // ======================
  if (queries.length > 0) {
    await prisma.$transaction(queries);
  }
};

const getUserSettings = (planSettings: PlanSetting | null) => {
  if (!planSettings) return {};

  const settings: UserUpdateArgs["data"] = {
    noOfCreditsUsed: 0,
    noOfCreditsAllocated: planSettings.noOfCredits,
    noOfCreditsLeft: planSettings.noOfCredits,
    noOfCharactersUsed: 0,
    noOfCharactersAllocated: planSettings.noOfCharacters,
    noOfCharactersLeft: planSettings.noOfCharacters,
    noOfWordsAllowed: planSettings.noOfWords,
    noOfVoicesUsed: 0,
    noOfVoicesAllocated: planSettings.noOfVoices,
    noOfVoicesLeft: planSettings.noOfVoices,
    noOfPremiumVoicesUsed: 0,
    noOfPremiumVoicesAllocated: planSettings.noOfPremiumVoices,
    noOfPremiumVoicesLeft: planSettings.noOfPremiumVoices,
    noOfCloneVoicesUsed: 0,
    noOfCloneVoicesAllocated: planSettings.noOfCloneVoices,
    noOfCloneVoicesLeft: planSettings.noOfCloneVoices,
    noOfImagesUsed: 0,
    noOfImagesAllocated: planSettings.noOfImages,
    noOfImagesLeft: planSettings.noOfImages,
    noOfMusicUsed: 0,
    noOfMusicAllocated: planSettings.noOfMusic,
    noOfMusicLeft: planSettings.noOfMusic,
    noOfVideosUsed: 0,
    noOfVideosAllocated: planSettings.noOfVideos,
    noOfVideosLeft: planSettings.noOfVideos,
  };

  return settings;
};
