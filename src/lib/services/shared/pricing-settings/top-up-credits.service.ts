import { PricingSetting, User } from "@/generated/prisma/client";

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
    user?.noOfCreditsLeft,
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
