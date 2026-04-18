import subscriptionRepo from "@/lib/repositories/subscription.repo";
import { getDefaultDp } from "../users/get-default-dp.service";
import { UserCredentials } from "./types";
import userRepo from "@/lib/repositories/user.repo";

/**
 * Gets user credentials. Used to return updated user status after user auth requests
 * @param userId The id of user
 * @returns User credentials to be return to client
 */
export const getCredentials = async (userId: string) => {
  const user = await userRepo.getById(userId);

  if (user == null) return;

  const subscription = await subscriptionRepo.getByUserIdAndIsActive(user.id);

  const credentials: UserCredentials = {
    email: user.email,
    emailVerified: user.emailVerified,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    dpUrl: getDefaultDp(user),
    blocked: user.blocked,
    phoneNumber: user.phoneNumber,
    hasActiveSubscription: user.hasActiveSubscription,

    noOfCreditsUsed: user.noOfCreditsUsed,
    // totalCreditsUsed: user.totalCreditsUsed,
    noOfCreditsAllocated: user.noOfCreditsAllocated,
    noOfCreditsLeft: user.noOfCreditsLeft,

    noOfCharactersUsed: user.noOfCharactersUsed,
    // totalCharactersUsed: user.totalCharactersUsed,
    noOfCharactersAllocated: user.noOfCharactersAllocated,
    noOfCharactersLeft: user.noOfCharactersLeft,
    noOfWordsAllowed: user.noOfWordsAllowed,

    // noOfVoicesUsed: user.noOfVoicesUsed,
    // totalVoicesUsed: user.totalVoicesUsed,
    // noOfVoicesAllocated: user.noOfVoicesAllocated,
    // noOfVoicesLeft: user.noOfVoicesLeft,

    noOfPremiumVoicesUsed: user.noOfPremiumVoicesUsed,
    // totalPremiumVoicesUsed: user.totalPremiumVoicesUsed,
    noOfPremiumVoicesAllocated: user.noOfPremiumVoicesAllocated,
    noOfPremiumVoicesLeft: user.noOfPremiumVoicesLeft,
    noOfCloneVoicesUsed: user.noOfCloneVoicesUsed,
    // totalCloneVoicesUsed: user.totalCloneVoicesUsed,
    noOfCloneVoicesAllocated: user.noOfCloneVoicesAllocated,
    noOfCloneVoicesLeft: user.noOfCloneVoicesLeft,

    noOfImagesUsed: user.noOfImagesUsed,
    // totalImagesUsed: user.totalImagesUsed,
    noOfImagesAllocated: user.noOfImagesAllocated,
    noOfImagesLeft: user.noOfImagesLeft,

    noOfMusicUsed: user.noOfMusicUsed,
    // totalMusicUsed: user.totalMusicUsed,
    noOfMusicAllocated: user.noOfMusicAllocated,
    noOfMusicLeft: user.noOfMusicLeft,

    noOfVideosUsed: user.noOfVideosUsed,
    // totalVideosUsed: user.totalVideosUsed,
    noOfVideosAllocated: user.noOfVideosAllocated,
    noOfVideosLeft: user.noOfVideosLeft,
    subscription: subscription
      ? {
          isActive: subscription.isActive,
          nextBillingDate: subscription.nextBillingDate,
          status: subscription.status,
          planName: subscription.planName,
        }
      : null,
  };

  return credentials;
};
