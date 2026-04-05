import { AdminJwtPayload } from "./AdminJwtResult";

export type AdminAuthItems = {
  loggedIn: boolean;
  adminId?: number;
  claims?: AdminJwtPayload;
  errorMessage?: string;
};
