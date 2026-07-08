import { PricingSetting, User } from "@/generated/prisma/client";
import { UserUpdateArgs } from "@/generated/prisma/models";

export const topUpCredits = (
  pricingSettings: PricingSetting,
  user?: User | null,
) => {
  const noOfCreditsAllocated = user ? (user.noOfCreditsAllocated ?? 0) : 0;
  const noOfCharactersAllocated = user
    ? (user.noOfCharactersAllocated ?? 0)
    : 0;
  const noOfVoicesAllocated = user ? (user.noOfVoicesAllocated ?? 0) : 0;
  const noOfPremiumVoicesAllocated = user
    ? (user.noOfPremiumVoicesAllocated ?? 0)
    : 0;
  const noOfCloneVoicesAllocated = user
    ? (user.noOfCloneVoicesAllocated ?? 0)
    : 0;
  const noOfImagesAllocated = user ? (user.noOfImagesAllocated ?? 0) : 0;
  const noOfMusicAllocated = user ? (user.noOfMusicAllocated ?? 0) : 0;
  const noOfVideosAllocated = user ? (user.noOfVideosAllocated ?? 0) : 0;

  const userSettings: Partial<User> = {
    noOfCreditsUsed: 0,
    noOfCreditsAllocated: !pricingSettings.noOfCredits
      ? null
      : pricingSettings.noOfCredits + noOfCreditsAllocated,
    noOfCreditsLeft: !pricingSettings.noOfCredits
      ? null
      : pricingSettings.noOfCredits + noOfCreditsAllocated,
    noOfCharactersUsed: 0,
    noOfCharactersAllocated: !pricingSettings.noOfCharacters
      ? null
      : pricingSettings.noOfCharacters + noOfCharactersAllocated,
    noOfCharactersLeft: !pricingSettings.noOfCharacters
      ? null
      : pricingSettings.noOfCharacters + noOfCharactersAllocated,
    noOfWordsAllowed: pricingSettings.noOfWordsAllowed,
    noOfVoicesUsed: 0,
    noOfVoicesAllocated: !pricingSettings.noOfVoices
      ? null
      : pricingSettings.noOfVoices + noOfVoicesAllocated,
    noOfVoicesLeft: !pricingSettings.noOfVoices
      ? null
      : pricingSettings.noOfVoices + noOfVoicesAllocated,
    noOfPremiumVoicesUsed: 0,
    noOfPremiumVoicesAllocated: !pricingSettings.noOfPremiumVoices
      ? null
      : pricingSettings.noOfPremiumVoices + noOfPremiumVoicesAllocated,
    noOfPremiumVoicesLeft: !pricingSettings.noOfPremiumVoices
      ? null
      : pricingSettings.noOfPremiumVoices + noOfPremiumVoicesAllocated,
    noOfCloneVoicesUsed: 0,
    noOfCloneVoicesAllocated: !pricingSettings.noOfCloneVoices
      ? null
      : pricingSettings.noOfCloneVoices + noOfCloneVoicesAllocated,
    noOfCloneVoicesLeft: !pricingSettings.noOfCloneVoices
      ? null
      : pricingSettings.noOfCloneVoices + noOfCloneVoicesAllocated,
    noOfImagesUsed: 0,
    noOfImagesAllocated: !pricingSettings.noOfImages
      ? null
      : pricingSettings.noOfImages + noOfImagesAllocated,
    noOfImagesLeft: !pricingSettings.noOfImages
      ? null
      : pricingSettings.noOfImages + noOfImagesAllocated,
    noOfMusicUsed: 0,
    noOfMusicAllocated: !pricingSettings.noOfMusic
      ? null
      : pricingSettings.noOfMusic + noOfMusicAllocated,
    noOfMusicLeft: !pricingSettings.noOfMusic
      ? null
      : pricingSettings.noOfMusic + noOfMusicAllocated,
    noOfVideosUsed: 0,
    noOfVideosAllocated: !pricingSettings.noOfVideos
      ? null
      : pricingSettings.noOfVideos + noOfVideosAllocated,
    noOfVideosLeft: !pricingSettings.noOfVideos
      ? null
      : pricingSettings.noOfVideos + noOfVideosAllocated,
    maxVideoDurationInSeconds: pricingSettings.maxVideoDurationInSeconds,
  };

  return userSettings;
};
