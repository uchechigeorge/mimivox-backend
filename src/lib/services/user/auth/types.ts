import { SubscriptionStatus } from "@/lib/data/SubscriptionStatus";

export type UserLoginResponse = {
  accessToken: string;
  refreshToken?: string;
  credentials?: UserCredentials;
};

export type UserRegisterResponse = {
  accessToken: string;
  refreshToken?: string;
  credentials?: UserCredentials;
};

export type UserMeResponse = {
  credentials?: UserCredentials;
};

export type UserResetPasswordResponse = {
  credentials?: UserCredentials;
};

export type UpdateDetailsResponse = {
  credentials?: UserCredentials;
};

export type UserCredentials = {
  email: string | null;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  dpUrl: string | null;
  phoneNumber: string | null;
  hasActiveSubscription: boolean;
  blocked: boolean;
  noOfCharactersUsed: number;
  noOfCharactersAllocated: number | null;
  noOfCharactersLeft: number | null;
  noOfVoicesUsed: number;
  noOfVoicesAllocated: number | null;
  noOfVoicesLeft: number | null;
  noOfWordsAllowed: number | null;
  subscription?: UserCredentialSubscription | null;
};

export type UserCredentialSubscription = {
  isActive: boolean;
  status: string;
  nextBillingDate: Date | null;
};

// export type RefreshTokenResponse = {
//   accessToken: string;
// };
