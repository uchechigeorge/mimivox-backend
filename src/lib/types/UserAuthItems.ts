import { UserId } from "./UserId";
import { UserJwtPayload } from "./UserJwtResult";

export type UserAuthItems = {
  loggedIn: boolean;
  userId?: UserId;
  userEmail?: string;
  userFullName?: string;
  hasActiveSubscription?: boolean;
  claims?: UserJwtPayload;
  errorMessage?: string;
};
