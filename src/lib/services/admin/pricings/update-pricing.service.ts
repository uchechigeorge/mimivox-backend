import { Pricing } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import { PricingUpdateDto } from "@/lib/dtos/admin/pricing.dto";
import paystackPlanRepo from "@/lib/repositories/paystack-pricing.repo";
import pricingRepo from "@/lib/repositories/pricing.repo";
import {
  BadRequestError,
  NotFoundError,
  PaystackServiceError,
} from "@/lib/utils/error.util";
import paystackPlanService from "../../shared/paystack/plan";
import { env } from "@/lib/config/env.config";

export const updatePricing = async (
  id: string,
  updateDto: PricingUpdateDto,
) => {
  let pricing = await pricingRepo.getById(id);
  if (!pricing) {
    throw new NotFoundError("Pricing not found");
  }

  const syncPaystack = env.SYNC_PAYSTACK_PRICINGS;
  let reference: string | null = null;
  let amount: number | null = null;
  let exists: boolean = false;
  if (syncPaystack) {
    const {
      reference: _reference,
      amount: _amount,
      exists: _exists,
    } = await handlePaystackUpdates(pricing);
    reference = _reference;
    amount = _amount;
    exists = exists;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Update pricing
      const pricingRecord = await pricingRepo.update(
        id,
        {
          price: updateDto.price,
          oldPrice: updateDto.oldPrice,
        },
        tx,
      );

      pricing = pricingRecord;

      if (syncPaystack && reference && amount) {
        if (exists) {
          const paystackPlan = await paystackPlanRepo.getByPricingId(
            pricing.id,
            tx,
          );

          if (paystackPlan) {
            await paystackPlanRepo.update(
              paystackPlan.id,
              {
                amount,
                reference,
              },
              tx,
            );
          }
        } else {
          await paystackPlanRepo.create(
            {
              pricingId: pricing.id,
              amount,
              reference,
            },
            tx,
          );
        }
      }

      return pricingRecord;
    });
  } catch (error: any) {
    throw new BadRequestError(`Could not update record: ${error.message}`);
  }

  const readDto = pricing;
  return readDto;
};

const handlePaystackUpdates = async (
  pricing: Pricing,
): Promise<PaystackUpdatesResult> => {
  const paystackPricing = await paystackPlanRepo.getByPricingId(pricing.id);

  const exists = !!paystackPricing;

  // No paystack pricing exists yet
  if (!paystackPricing) {
    // Paystack valid intervals:
    // daily, weekly, monthly, quarterly, biannually, annually

    let interval: string;

    switch (pricing.intervalType) {
      case "Day":
        interval = "daily";
        break;

      case "Week":
        interval = "weekly";
        break;

      case "Month":
        interval = "monthly";
        break;

      case "Year":
        interval = "annually";
        break;

      default:
        throw new PaystackServiceError("Invalid interval type");
    }

    const [plans, planError] = await paystackPlanService.listPlans({
      interval,
    });
    if (planError) {
      throw new PaystackServiceError(
        `Failed to list Paystack plans: ${planError.message}`,
      );
    }

    const appName = env.APP_NAME;

    const existingPlan = plans.find(
      (p) => p.name?.includes(appName) && p.name?.includes(pricing.name ?? ""),
    );

    if (existingPlan) {
      if (!existingPlan.plan_code) {
        throw new PaystackServiceError(
          "Existing plan does not have a plan code",
        );
      }

      // Update existing plan
      await paystackPlanService.updatePlan(existingPlan.plan_code, {
        amount: pricing.price.toNumber() * 100,
      });

      return {
        reference: existingPlan.plan_code,
        amount: existingPlan.amount,
        exists,
      };
    }

    // Create new plan
    const [newPlan, newPlanError] = await paystackPlanService.createPlan({
      name: `${appName}: ${pricing.name}`,
      amount: pricing.price.toNumber() * 100,
      interval,
    });

    if (newPlanError || !newPlan.plan_code) {
      throw newPlanError;
    }

    return {
      reference: newPlan.plan_code,
      amount: newPlan.amount,
      exists,
    };
  }

  // Existing paystack pricing exists
  if (!paystackPricing.reference) {
    throw new PaystackServiceError(
      "Paystack pricing does not have a reference",
    );
  }

  // Update existing paystack plan
  if (paystackPricing.amount !== pricing.price.mul(100)) {
    await paystackPlanService.updatePlan(paystackPricing.reference, {
      amount: pricing.price.toNumber() * 100,
    });
  }

  return {
    reference: paystackPricing.reference,
    amount: paystackPricing.amount.toNumber(),
    exists,
  };
};

type PaystackUpdatesResult = {
  reference: string;
  amount: number;
  exists: boolean;
};
