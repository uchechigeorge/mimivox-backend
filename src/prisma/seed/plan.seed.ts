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
      // pricings: {
      //   create: [
      //     {
      //       name: "Free Monthly",
      //       slug: "free-monthly",
      //       interval: "Monthly",
      //       intervalCount: 1,
      //       intervalType: "Month",
      //       planName: "Free",
      //       price: 10,
      //     },
      //     {
      //       name: "Free Yearly",
      //       slug: "free-yearly",
      //       interval: "Yearly",
      //       intervalCount: 1,
      //       intervalType: "Year",
      //       planName: "Free",
      //       price: 100,
      //     },
      //   ],
      // },
      settings: {
        create: {
          planName: "Free",
          noOfCredits: 5000,
          noOfCharacters: 5000,
          noOfWords: 3000,
          noOfVoices: 0,
          noOfPremiumVoices: 0,
          noOfCloneVoices: 0,
          noOfImages: 0,
          noOfMusic: 0,
          noOfVideos: 0,
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
          noOfCredits: 30000,
          noOfCharacters: 30000,
          noOfWords: 5000,
          noOfVoices: 10,
          noOfPremiumVoices: 10,
          noOfCloneVoices: 2,
          noOfImages: 20,
          noOfMusic: 10,
          noOfVideos: 3,
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
            price: 25,
          },
          {
            name: "Pro Yearly",
            slug: "pro-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Pro",
            price: 250,
          },
        ],
      },
      settings: {
        create: {
          planName: "Pro",
          noOfCredits: 75000,
          noOfCharacters: 75000,
          noOfWords: 100000,
          noOfVoices: 5,
          noOfCloneVoices: 5,
          noOfPremiumVoices: 20,
          noOfImages: 50,
          noOfMusic: 25,
          noOfVideos: 10,
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
            price: 50,
          },
          {
            name: "Business Yearly",
            slug: "business-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Business",
            price: 500,
          },
        ],
      },
      settings: {
        create: {
          planName: "Business",
          noOfCredits: 150000,
          noOfCharacters: 150000,
          noOfWords: 15000,
          noOfVoices: 10,
          noOfCloneVoices: 10,
          noOfPremiumVoices: 50,
          noOfImages: 100,
          noOfMusic: 50,
          noOfVideos: 20,
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
            price: 100,
          },
          {
            name: "Enterprise Yearly",
            slug: "enterprise-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Enterprise",
            price: 1000,
          },
        ],
      },
      settings: {
        create: {
          planName: "Enterprise",
          noOfCredits: 400000,
          noOfCharacters: 400000,
          noOfWords: 20000,
          noOfVoices: 100,
          noOfCloneVoices: 100,
          noOfPremiumVoices: 150,
          noOfImages: 500,
          noOfMusic: 200,
          noOfVideos: 100,
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
