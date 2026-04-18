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
  noOfCreditsUsed: number;
  // totalCreditsUsed: number;
  noOfCreditsAllocated: number | null;
  noOfCreditsLeft: number | null;
  noOfCharactersUsed: number;
  // totalCharactersUsed: number;
  noOfCharactersAllocated: number | null;
  noOfCharactersLeft: number | null;
  noOfWordsAllowed: number | null;
  // noOfVoicesUsed: number;
  // totalVoicesUsed: number;
  // noOfVoicesAllocated: number | null;
  // noOfVoicesLeft: number | null;
  noOfPremiumVoicesUsed: number;
  // totalPremiumVoicesUsed: number;
  noOfPremiumVoicesAllocated: number | null;
  noOfPremiumVoicesLeft: number | null;
  noOfCloneVoicesUsed: number;
  // totalCloneVoicesUsed: number;
  noOfCloneVoicesAllocated: number | null;
  noOfCloneVoicesLeft: number | null;
  noOfMusicUsed: number;
  // totalMusicUsed: number;
  noOfMusicAllocated: number | null;
  noOfMusicLeft: number | null;
  noOfImagesUsed: number;
  // totalImagesUsed: number;
  noOfImagesAllocated: number | null;
  noOfImagesLeft: number | null;
  noOfVideosUsed: number;
  // totalVideosUsed: number;
  noOfVideosAllocated: number | null;
  noOfVideosLeft: number | null;
  subscription?: UserCredentialSubscription | null;
};

export type UserCredentialSubscription = {
  isActive: boolean;
  status: string;
  planName: string;
  nextBillingDate: Date | null;
};

// export type RefreshTokenResponse = {
//   accessToken: string;
// };
