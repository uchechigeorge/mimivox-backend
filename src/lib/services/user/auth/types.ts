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
  hasValidSubscription: boolean;
  blocked: boolean;
  subscription?: UserCredentialSubscription | null;
};

export type UserCredentialSubscription = {
  isValid: boolean;
  statusId: SubscriptionStatus;
  statusName: string;
  nextBillingDate: Date | null;
};

// export type RefreshTokenResponse = {
//   accessToken: string;
// };
