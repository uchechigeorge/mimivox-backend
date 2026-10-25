import { PricingSetting, User } from "@/generated/prisma/client";

// Top up credits end with the plan period; they are spent last, so only the
// part of the balance that is still unspent can expire
export const getExpiringTopUpCredits = (user?: User | null) =>
  Math.min(user?.noOfTopUpCreditsLeft ?? 0, user?.noOfCreditsLeft ?? 0);

// Removes unspent Top up credits from a user whose plan period has ended
export const expireTopUpCredits = (user: User): Partial<User> => {
  const expiring = getExpiringTopUpCredits(user);

  return {
    noOfTopUpCreditsLeft: 0,
    noOfCreditsAllocated:
      user.noOfCreditsAllocated == null
        ? null
        : Math.max(0, user.noOfCreditsAllocated - expiring),
    noOfCreditsLeft:
      user.noOfCreditsLeft == null ? null : user.noOfCreditsLeft - expiring,
  };
};

export const topUpCredits = (
  pricingSettings: PricingSetting,
  user?: User | null,
) => {
  const addUnusedBalance = (
    allowance: number | null,
    remaining: number | null | undefined,
  ) => (allowance === null ? null : allowance + (remaining ?? 0));

  const noOfCredits = addUnusedBalance(
    pricingSettings.noOfCredits,
    user?.noOfCreditsLeft == null
      ? user?.noOfCreditsLeft
      : user.noOfCreditsLeft - getExpiringTopUpCredits(user),
  );
  const noOfCharacters = addUnusedBalance(
    pricingSettings.noOfCharacters,
    user?.noOfCharactersLeft,
  );
  const noOfVoices = addUnusedBalance(
    pricingSettings.noOfVoices,
    user?.noOfVoicesLeft,
  );
  const noOfPremiumVoices = addUnusedBalance(
    pricingSettings.noOfPremiumVoices,
    user?.noOfPremiumVoicesLeft,
  );
  const noOfCloneVoices = addUnusedBalance(
    pricingSettings.noOfCloneVoices,
    user?.noOfCloneVoicesLeft,
  );
  const noOfImages = addUnusedBalance(
    pricingSettings.noOfImages,
    user?.noOfImagesLeft,
  );
  const noOfMusic = addUnusedBalance(
    pricingSettings.noOfMusic,
    user?.noOfMusicLeft,
  );
  const noOfVideos = addUnusedBalance(
    pricingSettings.noOfVideos,
    user?.noOfVideosLeft,
  );

  const userSettings: Partial<User> = {
    noOfCreditsUsed: 0,
    noOfCreditsAllocated: noOfCredits,
    noOfCreditsLeft: noOfCredits,
    noOfTopUpCreditsLeft: 0,
    noOfCharactersUsed: 0,
    noOfCharactersAllocated: noOfCharacters,
    noOfCharactersLeft: noOfCharacters,
    noOfWordsAllowed: pricingSettings.noOfWordsAllowed,
    noOfVoicesUsed: 0,
    noOfVoicesAllocated: noOfVoices,
    noOfVoicesLeft: noOfVoices,
    noOfPremiumVoicesUsed: 0,
    noOfPremiumVoicesAllocated: noOfPremiumVoices,
    noOfPremiumVoicesLeft: noOfPremiumVoices,
    noOfCloneVoicesUsed: 0,
    noOfCloneVoicesAllocated: noOfCloneVoices,
    noOfCloneVoicesLeft: noOfCloneVoices,
    noOfImagesUsed: 0,
    noOfImagesAllocated: noOfImages,
    noOfImagesLeft: noOfImages,
    noOfMusicUsed: 0,
    noOfMusicAllocated: noOfMusic,
    noOfMusicLeft: noOfMusic,
    noOfVideosUsed: 0,
    noOfVideosAllocated: noOfVideos,
    noOfVideosLeft: noOfVideos,
    maxVideoDurationInSeconds: pricingSettings.maxVideoDurationInSeconds,
  };

  return userSettings;
};
