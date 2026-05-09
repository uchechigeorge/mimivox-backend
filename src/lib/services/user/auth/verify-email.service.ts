import { env } from "@/lib/config/env.config";
import userTokenRepo from "@/lib/repositories/user-token.repo";
import userRepo from "@/lib/repositories/user.repo";
import { UserAuthItems } from "@/lib/types";
import { BadRequestError, UnauthorizedError } from "@/lib/utils/error.util";
import { generateRandomString } from "@/lib/utils/security.utils";
import { isNotNullOrWhitespace } from "@/lib/utils/type.utils";
import ms from "ms";
import notificationService from "../notifications";
import { VerifyEmailConfirmTokenDto } from "@/lib/dtos/user/auth.dto";

export const sendEmail = async (authItems: UserAuthItems) => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  const EXPIRATION_TIME = (env.USER_VERIFY_EMAIL_EXPIRATION ??
    "24h") as ms.StringValue;

  const user = await userRepo.getById(userId);
  if (!user) throw new UnauthorizedError("Invalid user");

  if (user.emailVerified) throw new BadRequestError("Email already verified");

  const userToken = await userTokenRepo.getByUserIdAndType(
    user.id,
    "VerifyEmail",
  );

  let token = "";
  let expiresAt = new Date();

  if (!userToken) {
    token = generateRandomString(6, { type: "numeric" });
    expiresAt = new Date(new Date().getTime() + ms(EXPIRATION_TIME));

    await userTokenRepo.create({
      userId: user.id,
      type: "VerifyEmail",
      token,
      expiresAt,
    });
  } else {
    const previousCode = userToken.token;
    const previousExpiry = userToken.expiresAt;

    const usePreviousCode =
      isNotNullOrWhitespace(previousCode) &&
      previousExpiry != null &&
      previousExpiry > new Date();

    token = usePreviousCode
      ? previousCode
      : generateRandomString(6, { type: "numeric" });
    expiresAt = usePreviousCode
      ? previousExpiry!
      : new Date(new Date().getTime() + ms(EXPIRATION_TIME));

    await userTokenRepo.update(userToken.id, {
      token,
      expiresAt,
    });
  }

  // Send email
  await notificationService.sendVerifyEmail(user.email, token, user.firstName);
};

export const confirmToken = async (
  body: VerifyEmailConfirmTokenDto,
  authItems: UserAuthItems,
) => {
  const userId = authItems.userId;
  if (!userId) throw new UnauthorizedError();

  // Check if credentials are valid
  const user = await userRepo.getById(userId);
  if (!user) throw new BadRequestError("Invalid user");

  const userToken = await userTokenRepo.getByUserIdTokenAndType(
    user.id,
    body.token,
    "VerifyEmail",
  );
  if (!userToken) throw new BadRequestError("Code is invalid/expired");

  const isTokenValid = await userTokenRepo.checkExpiry(
    userId,
    body.token,
    "VerifyEmail",
  );

  if (!isTokenValid) throw new BadRequestError("Code is invalid/expired");

  // Verify email
  await userRepo.update(user.id, { emailVerified: true });
  await userTokenRepo.update(userToken.id, {
    usedAt: new Date(),
  });
};

const verifyEmail = {
  sendEmail,
  confirmToken,
};

export default verifyEmail;
