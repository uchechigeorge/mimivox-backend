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
    noOfCharactersUsed: user.noOfCharactersUsed,
    noOfCharactersAllocated: user.noOfCharactersAllocated,
    noOfCharactersLeft: user.noOfCharactersLeft,
    noOfVoicesUsed: user.noOfVoicesUsed,
    noOfVoicesAllocated: user.noOfVoicesAllocated,
    noOfVoicesLeft: user.noOfVoicesLeft,
    noOfWordsAllowed: user.noOfWordsAllowed,
    subscription: subscription
      ? {
          isActive: subscription.isActive,
          nextBillingDate: subscription.nextBillingDate,
          status: subscription.status,
        }
      : null,
  };

  return credentials;
};
