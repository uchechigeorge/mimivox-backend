import {
  PlanCreateInput,
  PlanSettingCreateInput,
  PricingCreateWithoutPlanInput,
  PricingSettingCreateInput,
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
            price: 7500,
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
                noOfMusic: 25,
                noOfVideos: 5,
                maxVideoDurationInSeconds: 8,
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
            price: 85000,
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
                noOfMusic: 25 * 12,
                noOfVideos: 5 * 12,
                maxVideoDurationInSeconds: 8,
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
            price: 15000,
            settings: {
              create: {
                pricingName: "Pro Monthly",
                noOfCredits: 75000,
                noOfCharacters: 75000,
                noOfWordsAllowed: 5000,
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
            name: "Pro Yearly",
            slug: "pro-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Pro",
            price: 165000,
            settings: {
              create: {
                pricingName: "Pro Yearly",
                noOfCredits: 75000 * 12,
                noOfCharacters: 75000 * 12,
                noOfWordsAllowed: 5000,
                noOfPremiumVoices: 20 * 12,
                noOfVoices: 5 * 12,
                noOfCloneVoices: 5 * 12,
                noOfImages: 250 * 12,
                noOfMusic: 60 * 12,
                noOfVideos: 10 * 12,
                maxVideoDurationInSeconds: 8,
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
            price: 30000,
            settings: {
              create: {
                pricingName: "Business Monthly",
                noOfCredits: 150000,
                noOfCharacters: 150000,
                noOfWordsAllowed: 15000,
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
            name: "Business Yearly",
            slug: "business-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Business",
            price: 340000,
            settings: {
              create: {
                pricingName: "Business Yearly",
                noOfCredits: 150000 * 12,
                noOfCharacters: 150000 * 12,
                noOfWordsAllowed: 15000 * 12,
                noOfPremiumVoices: 50 * 12,
                noOfVoices: 10 * 12,
                noOfCloneVoices: 10 * 12,
                noOfImages: 500 * 12,
                noOfMusic: 150 * 12,
                noOfVideos: 15 * 12,
                maxVideoDurationInSeconds: 12,
              },
            },
          },
        ],
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
            settings: {
              create: {
                pricingName: "Enterprise Monthly",
                noOfCredits: 400000,
                noOfCharacters: 400000,
                noOfWordsAllowed: 15000,
                noOfPremiumVoices: 120,
                noOfVoices: 50,
                noOfCloneVoices: 50,
                noOfImages: 1200,
                noOfMusic: 300,
                noOfVideos: 30,
                maxVideoDurationInSeconds: 15,
              },
            },
          },
          {
            name: "Enterprise Yearly",
            slug: "enterprise-yearly",
            interval: "Yearly",
            intervalCount: 1,
            intervalType: "Year",
            planName: "Enterprise",
            price: 750000,
            settings: {
              create: {
                pricingName: "Enterprise Yearly",
                noOfCredits: 400000 * 12,
                noOfCharacters: 400000 * 12,
                noOfWordsAllowed: 15000 * 12,
                noOfPremiumVoices: 120 * 12,
                noOfVoices: 50 * 12,
                noOfCloneVoices: 50 * 12,
                noOfImages: 1200 * 12,
                noOfMusic: 300 * 12,
                noOfVideos: 30 * 12,
                maxVideoDurationInSeconds: 15,
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
    // const settings = settingsData?.create as PlanSettingCreateInput | undefined;
    // if (!settings) {
    //   throw new Error(`Settings data is required for plan: ${plan.name}`);
    // }

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
        const settings = pricing.settings?.create as
          | PricingSettingCreateInput
          | undefined;
        if (!settings) {
          throw new Error(
            `Settings data is required for pricing: ${pricing.name}`,
          );
        }
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

    // // Create setting
    // await prisma.planSetting.upsert({
    //   where: { planId: createdPlan.id },
    //   create: {
    //     ...settings,
    //     plan: {
    //       connect: { id: createdPlan.id },
    //     },
    //   },
    //   update: {
    //     ...settings,
    //     plan: {
    //       connect: { id: createdPlan.id },
    //     },
    //   },
    // });
  }
}
