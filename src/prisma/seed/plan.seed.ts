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
                noOfPremiumVoices: 1,
                noOfCloneVoices: 0,
                noOfImages: 5,
                noOfMusic: 3,
                noOfVideos: 2,
                maxVideoDurationInSeconds: 4,
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
                noOfPremiumVoices: 10,
                noOfVoices: 2,
                noOfCloneVoices: 2,
                noOfImages: 120,
                noOfMusic: 50,
                noOfVideos: 5,
                maxVideoDurationInSeconds: 5,
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
                noOfPremiumVoices: 10 * 12,
                noOfVoices: 2 * 12,
                noOfCloneVoices: 2 * 12,
                noOfImages: 120 * 12,
                noOfMusic: 50 * 12,
                noOfVideos: 5 * 12,
                maxVideoDurationInSeconds: 5,
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
                noOfPremiumVoices: 20,
                noOfVoices: 5,
                noOfCloneVoices: 5,
                noOfImages: 250,
                noOfMusic: 120,
                noOfVideos: 10,
                maxVideoDurationInSeconds: 30,
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
                noOfPremiumVoices: 20 * 12,
                noOfVoices: 5 * 12,
                noOfCloneVoices: 5 * 12,
                noOfImages: 250 * 12,
                noOfMusic: 120 * 12,
                noOfVideos: 10 * 12,
                maxVideoDurationInSeconds: 30,
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
                noOfPremiumVoices: 50,
                noOfVoices: 10,
                noOfCloneVoices: 10,
                noOfImages: 500,
                noOfMusic: 300,
                noOfVideos: 15,
                maxVideoDurationInSeconds: 30,
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
                noOfPremiumVoices: 50 * 12,
                noOfVoices: 10 * 12,
                noOfCloneVoices: 10 * 12,
                noOfImages: 500 * 12,
                noOfMusic: 300 * 12,
                noOfVideos: 15 * 12,
                maxVideoDurationInSeconds: 30,
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
                noOfPremiumVoices: 120,
                noOfVoices: 50,
                noOfCloneVoices: 50,
                noOfImages: 1200,
                noOfMusic: 600,
                noOfVideos: 30,
                maxVideoDurationInSeconds: 30,
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
                noOfPremiumVoices: 120 * 12,
                noOfVoices: 50 * 12,
                noOfCloneVoices: 50 * 12,
                noOfImages: 1200 * 12,
                noOfMusic: 600 * 12,
                noOfVideos: 30 * 12,
                maxVideoDurationInSeconds: 30,
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
      }
    }
  }
}
