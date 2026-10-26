import {
  PlanCreateInput,
  PricingCreateWithoutPlanInput,
} from "@/generated/prisma/models";
import { prisma } from "@/lib/db/prisma";

export default async function seedPlans() {
  const plans: PlanCreateInput[] = [
    {
      name: "Free",
      slug: "free",
      isFree: true,
      pricings: {
        create: [
          {
            name: "Free",
            slug: "free",
            interval: "Lifetime",
            intervalCount: 0,
            intervalType: "None",
            planName: "Free",
            price: 0,
            isFree: true,
            settings: {
              create: {
                pricingName: "Free",
                noOfCredits: 7500,
                noOfCharacters: 7500,
                noOfWordsAllowed: 500,
                noOfVoices: 0,
                noOfPremiumVoices: null,
                noOfCloneVoices: 0,
                noOfImages: null,
                noOfMusic: null,
                noOfVideos: null,
                maxVideoDurationInSeconds: null,
              },
            },
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
            price: 10500,
            settings: {
              create: {
                pricingName: "Starter Monthly",
                noOfCredits: 30000,
                noOfCharacters: 30000,
                noOfWordsAllowed: 2000,
                noOfPremiumVoices: null,
                noOfVoices: 2,
                noOfCloneVoices: 2,
                noOfImages: null,
                noOfMusic: null,
                noOfVideos: null,
                maxVideoDurationInSeconds: null,
              },
            },
          },
          {
            name: "Starter Yearly",
            slug: "starter-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Starter",
            price: 100800,
            settings: {
              create: {
                pricingName: "Starter Yearly",
                noOfCredits: 30000 * 12,
                noOfCharacters: 30000 * 12,
                noOfWordsAllowed: 2000,
                noOfPremiumVoices: null,
                noOfVoices: 2 * 12,
                noOfCloneVoices: 2 * 12,
                noOfImages: null,
                noOfMusic: null,
                noOfVideos: null,
                maxVideoDurationInSeconds: null,
              },
            },
          },
        ],
      },
    },
    {
      name: "Creator",
      slug: "creator",
      pricings: {
        create: [
          {
            name: "Creator Monthly",
            slug: "creator-monthly",
            interval: "Monthly",
            intervalCount: 1,
            intervalType: "Month",
            planName: "Creator",
            price: 18000,
            settings: {
              create: {
                pricingName: "Creator Monthly",
                noOfCredits: 100000,
                noOfCharacters: 100000,
                noOfWordsAllowed: 5000,
                noOfPremiumVoices: null,
                noOfVoices: 5,
                noOfCloneVoices: 5,
                noOfImages: null,
                noOfMusic: null,
                noOfVideos: null,
                maxVideoDurationInSeconds: null,
              },
            },
          },
          {
            name: "Creator Yearly",
            slug: "creator-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Creator",
            price: 172800,
            settings: {
              create: {
                pricingName: "Creator Yearly",
                noOfCredits: 100000 * 12,
                noOfCharacters: 100000 * 12,
                noOfWordsAllowed: 5000,
                noOfPremiumVoices: null,
                noOfVoices: 5 * 12,
                noOfCloneVoices: 5 * 12,
                noOfImages: null,
                noOfMusic: null,
                noOfVideos: null,
                maxVideoDurationInSeconds: null,
              },
            },
          },
        ],
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
            price: 45000,
            settings: {
              create: {
                pricingName: "Pro Monthly",
                noOfCredits: 250000,
                noOfCharacters: 250000,
                noOfWordsAllowed: 15000,
                noOfPremiumVoices: null,
                noOfVoices: 10,
                noOfCloneVoices: 10,
                noOfImages: null,
                noOfMusic: null,
                noOfVideos: null,
                maxVideoDurationInSeconds: null,
              },
            },
          },
          {
            name: "Pro Yearly",
            slug: "pro-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Pro",
            price: 432000,
            settings: {
              create: {
                pricingName: "Pro Yearly",
                noOfCredits: 250000 * 12,
                noOfCharacters: 250000 * 12,
                noOfWordsAllowed: 15000,
                noOfPremiumVoices: null,
                noOfVoices: 10 * 12,
                noOfCloneVoices: 10 * 12,
                noOfImages: null,
                noOfMusic: null,
                noOfVideos: null,
                maxVideoDurationInSeconds: null,
              },
            },
          },
        ],
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
            price: 105000,
            settings: {
              create: {
                pricingName: "Business Monthly",
                noOfCredits: 500000,
                noOfCharacters: 500000,
                noOfWordsAllowed: 15000,
                noOfPremiumVoices: null,
                noOfVoices: 50,
                noOfCloneVoices: 50,
                noOfImages: null,
                noOfMusic: null,
                noOfVideos: null,
                maxVideoDurationInSeconds: null,
              },
            },
          },
          {
            name: "Business Yearly",
            slug: "business-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Business",
            price: 1008000,
            settings: {
              create: {
                pricingName: "Business Yearly",
                noOfCredits: 500000 * 12,
                noOfCharacters: 500000 * 12,
                noOfWordsAllowed: 15000,
                noOfPremiumVoices: null,
                noOfVoices: 50 * 12,
                noOfCloneVoices: 50 * 12,
                noOfImages: null,
                noOfMusic: null,
                noOfVideos: null,
                maxVideoDurationInSeconds: null,
              },
            },
          },
        ],
      },
    },
  ];

  let pricingSequenceCounter = 1;
  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i];
    const { pricings: pricingsData, ...data } = plan;

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
        const { settings: settingsData, ...pricing } = pricings[j];

        pricing.sequence = pricingSequenceCounter++;

        const createdPricing = await prisma.pricing.upsert({
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

        if (!settingsData || !settingsData.create) {
          throw new Error(
            `Settings data is required for pricing: ${pricing.name}`,
          );
        }
        const settings = settingsData.create;

        await prisma.pricingSetting.upsert({
          where: { pricingId: createdPricing.id },
          create: {
            ...settings,
            pricing: {
              connect: { id: createdPricing.id },
            },
          },
          update: {
            ...settings,
            pricing: {
              connect: { id: createdPricing.id },
            },
          },
        });

        // The plans endpoint reads the plan level settings, so mirror the first pricing
        if (j === 0) {
          const { pricingName, ...planSettings } = settings;

          await prisma.planSetting.upsert({
            where: { planId: createdPlan.id },
            create: {
              ...planSettings,
              planName: data.name,
              plan: {
                connect: { id: createdPlan.id },
              },
            },
            update: {
              ...planSettings,
              planName: data.name,
            },
          });
        }
      }
    }
  }
}
