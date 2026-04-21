import { UserResetPasswordDto } from "@/lib/dtos/user/auth.dto";
import userRepo from "@/lib/repositories/user.repo";
import { UserAuthItems } from "@/lib/types";
import { UnauthorizedError } from "@/lib/utils/error.util";
import { comparePassword, hashPassword } from "./auth-helpers.service";
import { getCredentials } from "./get-credentials.service";
import { UserResetPasswordResponse } from "./types";

export const resetPassword = async (
  dto: UserResetPasswordDto,
  authItems: UserAuthItems,
) => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError();

  const isValidPassword = await comparePassword(dto.oldPassword, user.password);
  if (!isValidPassword) throw new UnauthorizedError("Invalid password");

  const hashedNewPassword = await hashPassword(dto.newPassword);
  await userRepo.update(userId, {
    password: hashedNewPassword,
  });

  const credentials = await getCredentials(userId);

  const response: UserResetPasswordResponse = {
    credentials,
  };

  return response;
};
