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

  if (updateDto.isActive && pricing == null) {
    throw new BadRequestError(
      "Pricing plan must be provided for active subscriptions",
    );
  }

  const startDate = updateDto.startDate ?? new Date();
  const initialAmount = Decimal(
    updateDto.amount ? updateDto.amount : (pricing?.price.toNumber() ?? 0),
  );
  const activeSubscription = await subscriptionRepo.getByUserIdAndIsActive(
    user.id,
    true,
  );

  await prisma.$transaction(
    async (tc) => {
      // Activate subscriptions
      if (activeSubscription == null && updateDto.isActive && pricing != null) {
        await subscriptionRepo.create(
          {
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
            reference: await sharedSubscriptionService.generateReference(tc),
          },
          tc,
        );

        const userSettings = getUserSettings(planSettings);
        await userRepo.update(
          user.id,
          {
            ...userSettings,
            hasActiveSubscription: true,
          },
          tc,
        );
      } else if (activeSubscription != null) {
        // Cancelling subscriptions
        if (updateDto.isActive == false) {
          await subscriptionRepo.update(
            activeSubscription.id,
            {
              isActive: false,
              status: "Completed",
              endDate: new Date(),
            },
            tc,
          );

          const freePlan = await planRepo.getByIsFree(tc);
          let freePlanSettings: PlanSetting | null = null;
          if (freePlan) {
            freePlanSettings = await planSettingRepo.getByPlanId(
              freePlan.id,
              tc,
            );
          }

          const userSettings = getUserSettings(freePlanSettings);
          await userRepo.update(
            user.id,
            {
              ...userSettings,
              hasActiveSubscription: false,
            },
            tc,
          );
        }
        // Changing plans
        else if (pricing != null) {
          await subscriptionRepo.update(
            activeSubscription.id,
            {
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
            tc,
          );

          const userSettings = getUserSettings(planSettings);
          await userRepo.update(
            user.id,
            {
              ...userSettings,
              hasActiveSubscription: true,
            },
            tc,
          );
        }
      }
    },
    {
      // maxWait: 10000,
      // timeout: 20000,
    },
  );
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
