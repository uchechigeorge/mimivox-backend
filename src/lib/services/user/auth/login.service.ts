import { LoginDto } from "@/lib/dtos/user/auth.dto";
import { BadRequestError } from "@/lib/utils/error";
import userRepo from "@/lib/repositories/user.repo";
import { comparePassword, generateAccessToken } from "./auth-helpers.service";
import { UserLoginResponse } from "./types";
import { getCredentials } from "./get-credentials.service";

export const login = async (body: LoginDto) => {
  const user = await userRepo.getByEmail(body.email);
  const invalidCredentialsMessage = "Invalid credentials";
  if (!user) throw new BadRequestError(invalidCredentialsMessage);

  const isValidPassword = await comparePassword(
    body.password,
    user.password ?? "",
  );
  if (!isValidPassword) throw new BadRequestError(invalidCredentialsMessage);

  if (user.blocked) throw new BadRequestError("Account blocked");

  const accessToken = generateAccessToken(user);
  const credentials = await getCredentials(user.id);
  const response: UserLoginResponse = {
    accessToken,
    // refreshToken: null, // TODO: Implement refresh token generation and return here
    credentials,
  };

  return response;
};
