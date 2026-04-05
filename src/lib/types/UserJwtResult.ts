import { UserId } from "./UserId";

export type UserJwtPayload = {
  userId: UserId;
  email: string;
  name: string;
  hasValidSubscription: boolean;
};
