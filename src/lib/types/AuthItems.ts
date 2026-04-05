import { AdminJwtPayload } from "./AdminJwtResult";
import { UserId } from "./UserId";
import { UserJwtPayload } from "./UserJwtResult";

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
  adminId?: number;
  claims?: AdminJwtPayload;
};
