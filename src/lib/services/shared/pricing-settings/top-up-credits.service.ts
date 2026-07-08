import { PricingSetting, User } from "@/generated/prisma/client";
import { UserUpdateArgs } from "@/generated/prisma/models";

export const topUpCredits = (pricingSettings: PricingSetting, user: User) => {
  const settings: UserUpdateArgs["data"] = {
    noOfCreditsUsed: 0,
    noOfCreditsAllocated: !pricingSettings.noOfCredits
      ? null
      : pricingSettings.noOfCredits + (user.noOfCreditsAllocated ?? 0),
    noOfCreditsLeft: !pricingSettings.noOfCredits
      ? null
      : pricingSettings.noOfCredits + (user.noOfCreditsAllocated ?? 0),
    noOfCharactersUsed: 0,
    noOfCharactersAllocated: !pricingSettings.noOfCharacters
      ? null
      : pricingSettings.noOfCharacters + (user.noOfCharactersAllocated ?? 0),
    noOfCharactersLeft: !pricingSettings.noOfCharacters
      ? null
      : pricingSettings.noOfCharacters + (user.noOfCharactersAllocated ?? 0),
    noOfWordsAllowed: pricingSettings.noOfWordsAllowed,
    noOfVoicesUsed: 0,
    noOfVoicesAllocated: !pricingSettings.noOfVoices
      ? null
      : pricingSettings.noOfVoices + (user.noOfVoicesAllocated ?? 0),
    noOfVoicesLeft: !pricingSettings.noOfVoices
      ? null
      : pricingSettings.noOfVoices + (user.noOfVoicesAllocated ?? 0),
    noOfPremiumVoicesUsed: 0,
    noOfPremiumVoicesAllocated: !pricingSettings.noOfPremiumVoices
      ? null
      : pricingSettings.noOfPremiumVoices +
        (user.noOfPremiumVoicesAllocated ?? 0),
    noOfPremiumVoicesLeft: !pricingSettings.noOfPremiumVoices
      ? null
      : pricingSettings.noOfPremiumVoices +
        (user.noOfPremiumVoicesAllocated ?? 0),
    noOfCloneVoicesUsed: 0,
    noOfCloneVoicesAllocated: !pricingSettings.noOfCloneVoices
      ? null
      : pricingSettings.noOfCloneVoices + (user.noOfCloneVoicesAllocated ?? 0),
    noOfCloneVoicesLeft: !pricingSettings.noOfCloneVoices
      ? null
      : pricingSettings.noOfCloneVoices + (user.noOfCloneVoicesAllocated ?? 0),
    noOfImagesUsed: 0,
    noOfImagesAllocated: !pricingSettings.noOfImages
      ? null
      : pricingSettings.noOfImages + (user.noOfImagesAllocated ?? 0),
    noOfImagesLeft: !pricingSettings.noOfImages
      ? null
      : pricingSettings.noOfImages + (user.noOfImagesAllocated ?? 0),
    noOfMusicUsed: 0,
    noOfMusicAllocated: !pricingSettings.noOfMusic
      ? null
      : pricingSettings.noOfMusic + (user.noOfMusicAllocated ?? 0),
    noOfMusicLeft: !pricingSettings.noOfMusic
      ? null
      : pricingSettings.noOfMusic + (user.noOfMusicAllocated ?? 0),
    noOfVideosUsed: 0,
    noOfVideosAllocated: !pricingSettings.noOfVideos
      ? null
      : pricingSettings.noOfVideos + (user.noOfVideosAllocated ?? 0),
    noOfVideosLeft: !pricingSettings.noOfVideos
      ? null
      : pricingSettings.noOfVideos + (user.noOfVideosAllocated ?? 0),
    maxVideoDurationInSeconds: pricingSettings.maxVideoDurationInSeconds,
  };

  return settings;
};
