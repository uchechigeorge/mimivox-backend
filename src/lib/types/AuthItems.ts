import { UserId } from "./UserId";
import { AdminJwtPayload, UserJwtPayload } from "./JwtResult";

export type AuthItems = {
  loggedIn: boolean;
  errorMessage?: string;
};

export type UserAuthItems = AuthItems & {
  userId?: UserId;
  userEmail?: string;
  userFullName?: string;
  hasActiveSubscription?: boolean;
  claims?: UserJwtPayload;
};

export type AdminAuthItems = AuthItems & {
  adminId?: string;
  adminName?: string;
  adminEmail?: string;
  claims?: AdminJwtPayload;
};
