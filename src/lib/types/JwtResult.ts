import { UserId } from "./UserId";

export type UserJwtPayload = {
  userId: UserId;
  email: string;
  name: string;
  hasActiveSubscription: boolean;
};

export type AdminJwtPayload = {
  adminId: string;
  email: string;
  name: string;
};
