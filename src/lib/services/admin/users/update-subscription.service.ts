import { PlanSetting, Pricing } from "@/generated/prisma/client";
import {
  UpdateUserSubscriptionDto,
  UpdateUserSubscriptionParams,
} from "@/lib/dtos/admin/user.dto";
import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import { UserId } from "@/lib/types/UserId";
import { getNextBillingDate } from "@/lib/utils/date.utils";
import { BadRequestError } from "@/lib/utils/error.util";
import { toAppIntervalType } from "../../shared/pricings/pricing-helper.service";
import { Decimal } from "@prisma/client/runtime/client";
import planSettingRepo from "@/lib/repositories/plan-setting.repo";
import planRepo from "@/lib/repositories/plan.repo";

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
    if (!pricing) {
      throw new BadRequestError("Plan settings not found");
    }
  }

  if (updateDto.isActive && pricing == null) {
    throw new BadRequestError(
      "Pricing plan must be provided for active subscriptions",
    );
  }

  const startDate = updateDto.startDate ?? new Date();
  const activeSubscription = await subscriptionRepo.getByUserIdAndIsActive(
    user.id,
    true,
  );
  const initialAmount = Decimal(
    updateDto.amount ? updateDto.amount : (pricing?.price.toNumber() ?? 0),
  );

  if (activeSubscription == null && updateDto.isActive && pricing != null) {
    await subscriptionRepo.create({
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
      reference: "",
    });

    await userRepo.update(user.id, {
      hasActiveSubscription: true,
      noOfCharactersAllocated: planSettings?.noOfCharacters,
      noOfCharactersLeft: planSettings?.noOfCharacters,
      noOfVoicesAllocated: planSettings?.noOfVoices,
      noOfVoicesLeft: planSettings?.noOfVoices,
      noOfWordsAllowed: planSettings?.noOfWords,
    });
  } else if (activeSubscription != null) {
    if (updateDto.isActive == false) {
      await subscriptionRepo.update(activeSubscription.id, {
        isActive: false,
        status: "Completed",
        endDate: new Date(),
      });

      const freePlan = await planRepo.getByIsFree();
      let freePlanSettings: PlanSetting | null = null;
      if (freePlan) {
        freePlanSettings = await planSettingRepo.getByPlanId(freePlan.id);
      }

      await userRepo.update(user.id, {
        hasActiveSubscription: false,
        noOfCharactersAllocated: freePlanSettings?.noOfCharacters,
        noOfCharactersLeft: freePlanSettings?.noOfCharacters,
        noOfVoicesAllocated: freePlanSettings?.noOfVoices,
        noOfVoicesLeft: freePlanSettings?.noOfVoices,
        noOfWordsAllowed: freePlanSettings?.noOfWords,
      });
    } else if (pricing != null) {
      await subscriptionRepo.update(activeSubscription.id, {
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
      });

      await userRepo.update(user.id, {
        hasActiveSubscription: true,
        noOfCharactersAllocated: planSettings?.noOfCharacters,
        noOfCharactersLeft: planSettings?.noOfCharacters,
        noOfVoicesAllocated: planSettings?.noOfVoices,
        noOfVoicesLeft: planSettings?.noOfVoices,
        noOfWordsAllowed: planSettings?.noOfWords,
      });
    }
  }
};
