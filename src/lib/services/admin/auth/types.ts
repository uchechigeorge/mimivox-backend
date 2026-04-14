export type AdminLoginResponse = {
  accessToken: string;
  refreshToken?: string;
  credentials?: AdminCredentials;
};

export type AdminMeResponse = {
  credentials?: AdminCredentials;
};

export type AdminResetPasswordResponse = {
  credentials?: AdminCredentials;
};

export type UpdateDetailsResponse = {
  credentials?: AdminCredentials;
};

export type AdminCredentials = {
  email: string | null;
  emailVerified: boolean;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  dpUrl: string | null;
  phoneNumber: string | null;
  blocked: boolean;
};
