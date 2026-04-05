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

  // const subscription = (
  //   await subscriptionRepo.getByUserIdAndActive(user.id, true)
  // )[0];

  const credentials: UserCredentials = {
    email: user.email,
    emailVerified: user.emailVerified,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    dpUrl: await getDefaultDp(user),
    blocked: user.blocked,
    phoneNumber: null, //user.phoneNumber,
    hasValidSubscription: user.hasValidSubscription,
    // nextSubscriptionPaymentDate: null,
    subscription: null,
    //  subscription
    //   ? {
    //       isValid: subscription.isActive,
    //       nextBillingDate: subscription.nextBillingDate,
    //       statusId: subscription.statusId,
    //       statusName: subscription.statusName ?? "Pending",
    //     }
    //   : null,
  };

  return credentials;
};
