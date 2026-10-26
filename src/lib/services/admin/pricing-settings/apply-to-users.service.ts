import { PricingSetting, User } from "@/generated/prisma/client";
import { UserUpdateArgs } from "@/generated/prisma/models";
import { prisma } from "@/lib/db/prisma";

type CountedField = {
  setting: keyof PricingSetting;
  allocated: keyof User;
  left: keyof User;
  used: keyof User;
};

const countedFields: CountedField[] = [
  {
    setting: "noOfCredits",
    allocated: "noOfCreditsAllocated",
    left: "noOfCreditsLeft",
    used: "noOfCreditsUsed",
  },
  {
    setting: "noOfPremiumVoices",
    allocated: "noOfPremiumVoicesAllocated",
    left: "noOfPremiumVoicesLeft",
    used: "noOfPremiumVoicesUsed",
  },
  {
    setting: "noOfCloneVoices",
    allocated: "noOfCloneVoicesAllocated",
    left: "noOfCloneVoicesLeft",
    used: "noOfCloneVoicesUsed",
  },
  {
    setting: "noOfImages",
    allocated: "noOfImagesAllocated",
    left: "noOfImagesLeft",
    used: "noOfImagesUsed",
  },
  {
    setting: "noOfMusic",
    allocated: "noOfMusicAllocated",
    left: "noOfMusicLeft",
    used: "noOfMusicUsed",
  },
  {
    setting: "noOfVideos",
    allocated: "noOfVideosAllocated",
    left: "noOfVideosLeft",
    used: "noOfVideosUsed",
  },
];

// A limit that changed moves each user's balance by the same amount, so what
// they already spent and any carried-over balance are kept. A null limit is unlimited.
const buildUserUpdate = (
  before: PricingSetting,
  after: PricingSetting,
  user: User,
): UserUpdateArgs["data"] => {
  const data: Record<string, number | null> = {};

  for (const field of countedFields) {
    const oldLimit = before[field.setting] as number | null;
    const newLimit = after[field.setting] as number | null;
    if (oldLimit === newLimit) continue;

    if (newLimit === null) {
      data[field.allocated] = null;
      data[field.left] = null;
      continue;
    }

    const allocated = user[field.allocated] as number | null;
    const left = user[field.left] as number | null;
    const used = user[field.used] as number;

    if (oldLimit === null || allocated === null || left === null) {
      data[field.allocated] = newLimit;
      data[field.left] = Math.max(0, newLimit - used);
    } else {
      const delta = newLimit - oldLimit;
      data[field.allocated] = Math.max(0, allocated + delta);
      data[field.left] = Math.max(0, left + delta);
    }
  }

  if (before.noOfWordsAllowed !== after.noOfWordsAllowed) {
    data.noOfWordsAllowed = after.noOfWordsAllowed;
  }
  if (before.maxVideoDurationInSeconds !== after.maxVideoDurationInSeconds) {
    data.maxVideoDurationInSeconds = after.maxVideoDurationInSeconds;
  }

  return data;
};

// Applies an edited pricing setting to the users it currently covers: subscribers
// of that pricing, or, for the free pricing, users without an active subscription.
export const applySettingChangeToUsers = async (
  before: PricingSetting,
  after: PricingSetting,
  isFreePricing: boolean,
) => {
  const users = isFreePricing
    ? await prisma.user.findMany({ where: { hasActiveSubscription: false } })
    : await prisma.user.findMany({
        where: {
          hasActiveSubscription: true,
          subscriptions: {
            some: { pricingId: after.pricingId, isActive: true },
          },
        },
      });

  let updated = 0;
  for (const user of users) {
    const data = buildUserUpdate(before, after, user);
    if (Object.keys(data).length === 0) continue;
    await prisma.user.update({ where: { id: user.id }, data });
    updated++;
  }

  return updated;
};
