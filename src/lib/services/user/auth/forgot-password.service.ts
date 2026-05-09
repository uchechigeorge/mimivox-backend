import { env } from "@/lib/config/env.config";
import {
  ForgotPasswordConfirmTokenDto,
  ForgotPasswordSendEmailDto,
} from "@/lib/dtos/user/auth.dto";
import userTokenRepo from "@/lib/repositories/user-token.repo";
import userRepo from "@/lib/repositories/user.repo";
import { getRandom, sleep } from "@/lib/utils/security.utils";
import crypto from "crypto";
import ms from "ms";
import notificationService from "../notifications";
import { BadRequestError } from "@/lib/utils/error.util";
import { hashPassword } from "./auth-helpers.service";

export const sendEmail = async (body: ForgotPasswordSendEmailDto) => {
  const EXPIRATION_TIME = (env.USER_FORGOT_PASSWORD_EXPIRATION ??
    "24h") as ms.StringValue;

  const defaultMessage =
    "An email with reset instructions will be sent to you if your email is found";
  const user = await userRepo.getByEmail(body.email);

  // Create an async setTimeOut with random wait times
  if (!user) {
    // Generate random wait time
    const sleepMs = getRandom(2000, 4000);
    await sleep(sleepMs);

    return defaultMessage;
  }

  let userToken = await userTokenRepo.getByUserIdAndType(
    user.id,
    "ForgotPassword",
  );

  let token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  let expiresAt = new Date();

  if (!userToken) {
    expiresAt = new Date(new Date().getTime() + ms(EXPIRATION_TIME));

    await userTokenRepo.create({
      userId: user.id,
      type: "ForgotPassword",
      token: tokenHash,
      expiresAt,
    });
  } else {
    expiresAt = new Date(new Date().getTime() + ms(EXPIRATION_TIME));

    await userTokenRepo.update(userToken.id, {
      token: tokenHash,
      expiresAt,
    });
  }

  // Send email
  await notificationService.sendForgotPassword(
    user.email,
    token,
    user.firstName,
  );

  return defaultMessage;
};

export const confirmToken = async (body: ForgotPasswordConfirmTokenDto) => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(body.token)
    .digest("hex");
  const userToken = await userTokenRepo.getByTokenAndType(
    tokenHash,
    "ForgotPassword",
  );

  const errorMessage = "Invalid or expired reset token";
  if (!userToken || !userToken.userId) throw new BadRequestError(errorMessage);

  const userId = userToken.userId;

  const isValidToken = await userTokenRepo.checkExpiry(
    userToken.userId,
    tokenHash,
    "ForgotPassword",
  );
  console.log({ tokenHash, userToken, isValidToken });
  if (!isValidToken) throw new BadRequestError(errorMessage);

  // Hash the new password
  const hashedPassword = await hashPassword(body.password);

  // Update the user's password
  await userRepo.update(userId, {
    password: hashedPassword,
  });
  // Clear reset token and expiry
  await userTokenRepo.update(userToken.id, {
    usedAt: new Date(),
    isRevoked: true,
  });
};

const forgotPassword = {
  sendEmail,
  confirmToken,
};

export default forgotPassword;
