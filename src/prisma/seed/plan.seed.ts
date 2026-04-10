import {
  PlanCreateInput,
  PlanSettingCreateInput,
  PricingCreateWithoutPlanInput,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/db/prisma";
import planRepo from "@/lib/repositories/plan.repo";

export default async function seedPlans() {
  if (await planRepo.exists()) return;

  const plans: PlanCreateInput[] = [
    {
      name: "Free",
      slug: "free",
      isFree: true,
      settings: {
        create: {
          planName: "Free",
          noOfCharacters: 5000,
          noOfVoices: 0,
          noOfWords: 3000,
        },
      },
      pricings: {
        create: [
          {
            name: "Free Monthly",
            slug: "free-monthly",
            interval: "Monthly",
            intervalCount: 1,
            intervalType: "Month",
            planName: "Free",
            price: 10,
          },
          {
            name: "Free Yearly",
            slug: "free-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Free",
            price: 100,
          },
        ],
      },
    },
    {
      name: "Starter",
      slug: "starter",
      pricings: {
        create: [
          {
            name: "Starter Monthly",
            slug: "starter-monthly",
            interval: "Monthly",
            intervalCount: 1,
            intervalType: "Month",
            planName: "Starter",
            price: 10,
          },
          {
            name: "Starter Yearly",
            slug: "starter-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Starter",
            price: 100,
          },
        ],
      },
      settings: {
        create: {
          planName: "Starter",
          noOfCharacters: 150000,
          noOfVoices: 2,
          noOfWords: 5000,
        },
      },
    },
    {
      name: "Pro",
      slug: "pro",
      pricings: {
        create: [
          {
            name: "Pro Monthly",
            slug: "pro-monthly",
            interval: "Monthly",
            intervalCount: 1,
            intervalType: "Month",
            planName: "Pro",
            price: 10,
          },
          {
            name: "Pro Yearly",
            slug: "pro-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Pro",
            price: 100,
          },
        ],
      },
      settings: {
        create: {
          planName: "Pro",
          noOfCharacters: 300000,
          noOfVoices: 5,
          noOfWords: 15000,
        },
      },
    },
    {
      name: "Business",
      slug: "business",
      pricings: {
        create: [
          {
            name: "Business Monthly",
            slug: "business-monthly",
            interval: "Monthly",
            intervalCount: 1,
            intervalType: "Month",
            planName: "Business",
            price: 10,
          },
          {
            name: "Business Yearly",
            slug: "business-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Business",
            price: 100,
          },
        ],
      },
      settings: {
        create: {
          planName: "Business",
          noOfCharacters: 1000000,
          noOfVoices: 10,
          noOfWords: 20000,
        },
      },
    },
    {
      name: "Enterprise",
      slug: "enterprise",
      pricings: {
        create: [
          {
            name: "Enterprise Monthly",
            slug: "enterprise-monthly",
            interval: "Monthly",
            intervalCount: 1,
            intervalType: "Month",
            planName: "Enterprise",
            price: 10,
          },
          {
            name: "Enterprise Yearly",
            slug: "enterprise-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Enterprise",
            price: 100,
          },
        ],
      },
      settings: {
        create: {
          planName: "Enterprise",
          noOfCharacters: null, // unlimited
          noOfVoices: null, // unlimited
          noOfWords: null, // unlimited
        },
      },
    },
  ];

  let pricingSequenceCounter = 1;
  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i];
    const { settings: settingsData, pricings: pricingsData, ...data } = plan;
    const settings = settingsData?.create as PlanSettingCreateInput | undefined;
    if (!settings) {
      throw new Error(`Settings data is required for plan: ${plan.name}`);
    }

    data.sequence = i + 1;
    const createdPlan = await prisma.plan.upsert({
      where: { slug: data.slug },
      create: {
        ...data,
      },
      update: {
        ...data,
      },
    });

    if (pricingsData?.create) {
      const pricings = pricingsData.create as PricingCreateWithoutPlanInput[];

      for (let j = 0; j < pricings.length; j++) {
        const pricing = pricings[j];
        pricing.sequence = pricingSequenceCounter++;

        await prisma.pricing.upsert({
          where: { slug: pricing.slug },
          create: {
            ...pricing,
            plan: {
              connect: { id: createdPlan.id },
            },
          },
          update: {
            ...pricing,
            plan: {
              connect: { id: createdPlan.id },
            },
          },
        });
      }
    }

    // Create setting
    await prisma.planSetting.upsert({
      where: { planId: createdPlan.id },
      create: {
        ...settings,
        plan: {
          connect: { id: createdPlan.id },
        },
      },
      update: {
        ...settings,
        plan: {
          connect: { id: createdPlan.id },
        },
      },
    });
  }
}
