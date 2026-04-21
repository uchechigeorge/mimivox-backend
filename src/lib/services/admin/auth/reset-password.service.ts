import { AdminResetPasswordDto } from "@/lib/dtos/admin/auth.dto";
import adminRepo from "@/lib/repositories/admin.repo";
import { AdminAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";
import { comparePassword, hashPassword } from "./auth-helpers.service";
import { getCredentials } from "./get-credentials.service";
import { AdminResetPasswordResponse } from "./types";

export const resetPassword = async (
  dto: AdminResetPasswordDto,
  authItems: AdminAuthItems,
) => {
  const adminId = authItems.adminId;
  if (!adminId) throw new UnauthorizedError();

  const admin = await adminRepo.getById(adminId);
  if (!admin) throw new UnauthorizedError();

  const isValidPassword = await comparePassword(
    dto.oldPassword,
    admin.password,
  );
  if (!isValidPassword) throw new UnauthorizedError("Invalid password");

  const hashedNewPassword = await hashPassword(dto.newPassword);
  await adminRepo.update(adminId, {
    password: hashedNewPassword,
  });

  const credentials = await getCredentials(adminId);

  const response: AdminResetPasswordResponse = {
    credentials,
  };

  return response;
};
