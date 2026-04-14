import { BadRequestError } from "@/lib/utils/error.util";
import adminRepo from "@/lib/repositories/admin.repo";
import { comparePassword, generateAccessToken } from "./auth-helpers.service";
import { AdminLoginResponse } from "./types";
import { getCredentials } from "./get-credentials.service";
import { AdminLoginDto } from "@/lib/dtos/admin/auth.dto";

export const login = async (body: AdminLoginDto) => {
  const admin = await adminRepo.getByEmail(body.email);
  const invalidCredentialsMessage = "Invalid credentials";
  if (!admin) throw new BadRequestError(invalidCredentialsMessage);

  const isValidPassword = await comparePassword(
    body.password,
    admin.password ?? "",
  );
  if (!isValidPassword) throw new BadRequestError(invalidCredentialsMessage);

  if (admin.blocked) throw new BadRequestError("Account blocked");

  const accessToken = generateAccessToken(admin);
  const credentials = await getCredentials(admin.id);
  const response: AdminLoginResponse = {
    accessToken,
    // refreshToken: null, // TODO: Implement refresh token generation and return here
    credentials,
  };

  return response;
};
