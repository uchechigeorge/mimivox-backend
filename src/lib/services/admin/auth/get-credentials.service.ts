import { getDefaultDp } from "../admins/get-default-dp.service";
import { AdminCredentials } from "./types";
import adminRepo from "@/lib/repositories/admin.repo";

/**
 * Gets admin credentials. Used to return updated admin status after admin auth requests
 * @param adminId The id of admin
 * @returns admin credentials to be return to client
 */
export const getCredentials = async (adminId: string) => {
  const admin = await adminRepo.getById(adminId);

  if (admin == null) return;

  const credentials: AdminCredentials = {
    email: admin.email,
    emailVerified: admin.emailVerified,
    firstName: admin.firstName,
    lastName: admin.lastName,
    fullName: admin.fullName,
    dpUrl: getDefaultDp(admin),
    blocked: admin.blocked,
    phoneNumber: admin.phoneNumber,
  };

  return credentials;
};
