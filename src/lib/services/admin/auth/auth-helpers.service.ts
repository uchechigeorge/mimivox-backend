import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyJwt } from "@/lib/utils/jwt.utils";
import ms from "ms";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "@/generated/prisma/client";
import { AdminJwtPayload } from "@/lib/types";
import { env } from "@/lib/config/env";

/**
 * Generates access token for admin login
 * @param admin The admin
 * @returns Generated jwt token
 */
export const generateAccessToken = (admin: User) => {
  const payload: JwtPayload & AdminJwtPayload = {
    sub: admin.id.toString(),
    adminId: admin.id,
    email: admin.email ?? "",
    name: admin.fullName ?? "",
  };

  // Generate jwt token based on admin details
  const jwtToken = jwt.sign(
    payload,
    process.env.JWT_ADMIN_ACCESS_SECRET ?? "",
    {
      expiresIn: `${env.JWT_ADMIN_ACCESS_EXPIRATION || "7d"}` as ms.StringValue, // Set expiration for token (7 days as default)
      issuer: process.env.HOST ?? "",
    },
  );

  return jwtToken;
};

/**
 * Generates refresh token for admin
 * @returns Generated token
 */
export const generateRefreshToken = () => {
  const refreshToken = crypto.randomBytes(32).toString("hex");

  return refreshToken;
};

export const verifyAccessToken = async (token: string) => {
  return await verifyJwt<AdminJwtPayload>(token, env.JWT_ADMIN_ACCESS_SECRET);
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
