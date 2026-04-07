import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyJwt } from "@/lib/utils/jwt";
import { UserJwtPayload } from "@/lib/types/UserJwtResult";
import ms from "ms";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "@/generated/prisma/client";

/**
 * Generates access token for user login
 * @param user The user
 * @returns Generated jwt token
 */
export const generateAccessToken = (user: User) => {
  const payload: JwtPayload & UserJwtPayload = {
    sub: user.id.toString(),
    userId: user.id,
    email: user.email ?? "",
    name: user.fullName ?? "",
    hasActiveSubscription: user.hasActiveSubscription,
  };

  // Generate jwt token based on user details
  const jwtToken = jwt.sign(payload, process.env.JWT_USER_ACCESS_SECRET ?? "", {
    expiresIn: `${
      process.env.JWT_USER_ACCESS_EXPIRATION || "7d"
    }` as ms.StringValue, // Set expiration for token (7 days as default)
    issuer: process.env.HOST ?? "",
  });

  return jwtToken;
};

/**
 * Generates refresh token for user
 * @returns Generated token
 */
export const generateRefreshToken = () => {
  const refreshToken = crypto.randomBytes(32).toString("hex");

  return refreshToken;
};

export const verifyAccessToken = async (token: string) => {
  return await verifyJwt<UserJwtPayload>(
    token,
    process.env.JWT_USER_ACCESS_SECRET ?? "",
  );
};

export const hashPassword = async (password: string) => {
  const hashed = await bcrypt.hash(password, 12);
  return hashed;
};

export const comparePassword = async (password: string, hash: string) => {
  const isValid = await bcrypt.compare(password, hash);
  return isValid;
};

const auth = {
  generateAccessToken,
  verifyAccessToken,
};

export default auth;
