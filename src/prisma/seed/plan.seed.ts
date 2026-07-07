import {
  PlanCreateInput,
  PlanSettingCreateInput,
  PricingCreateWithoutPlanInput,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/db/prisma";
import planRepo from "@/lib/repositories/plan.repo";

export default async function seedPlans() {
  // if (await planRepo.exists()) return;

  const plans: PlanCreateInput[] = [
    {
      name: "Free",
      slug: "free",
      isFree: true,
      settings: {
        create: {
          planName: "Free",
          noOfCredits: 7500,
          noOfCharacters: 7500,
          noOfWords: 500,
          noOfVoices: 0,
          noOfPremiumVoices: 1,
          noOfCloneVoices: 0,
          noOfImages: 5,
          noOfMusic: 3,
          noOfVideos: 2,
          maxVideoDurationInSeconds: 4,
        },
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
            price: 7500,
          },
          {
            name: "Starter Yearly",
            slug: "starter-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Starter",
            price: 85000,
          },
        ],
      },
      settings: {
        create: {
          planName: "Starter",
          noOfCredits: 30000,
          noOfCharacters: 30000,
          noOfWords: 2000,
          noOfPremiumVoices: 10,
          noOfVoices: 2,
          noOfCloneVoices: 2,
          noOfImages: 120,
          noOfMusic: 25,
          noOfVideos: 5,
          maxVideoDurationInSeconds: 8,
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
            price: 15000,
          },
          {
            name: "Pro Yearly",
            slug: "pro-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Pro",
            price: 165000,
          },
        ],
      },
      settings: {
        create: {
          planName: "Pro",
          noOfCredits: 75000,
          noOfCharacters: 75000,
          noOfWords: 5000,
          noOfPremiumVoices: 20,
          noOfVoices: 5,
          noOfCloneVoices: 5,
          noOfImages: 250,
          noOfMusic: 60,
          noOfVideos: 10,
          maxVideoDurationInSeconds: 8,
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
            price: 30000,
          },
          {
            name: "Business Yearly",
            slug: "business-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Business",
            price: 340000,
          },
        ],
      },
      settings: {
        create: {
          planName: "Business",
          noOfCredits: 150000,
          noOfCharacters: 150000,
          noOfWords: 15000,
          noOfPremiumVoices: 50,
          noOfVoices: 10,
          noOfCloneVoices: 10,
          noOfImages: 500,
          noOfMusic: 150,
          noOfVideos: 15,
          maxVideoDurationInSeconds: 12,
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
            price: 70000,
          },
          {
            name: "Enterprise Yearly",
            slug: "enterprise-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Enterprise",
            price: 750000,
          },
        ],
      },
      settings: {
        create: {
          planName: "Enterprise",
          noOfCredits: 400000,
          noOfCharacters: 400000,
          noOfWords: 15000,
          noOfVoices: 50,
          noOfCloneVoices: 50,
          noOfPremiumVoices: 120,
          noOfImages: 1200,
          noOfMusic: 300,
          noOfVideos: 30,
          maxVideoDurationInSeconds: 15,
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
