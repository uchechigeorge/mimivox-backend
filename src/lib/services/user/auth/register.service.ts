import { RegisterDto } from "@/lib/dtos/user/auth.dto";
import userRepo from "@/lib/repositories/user.repo";
import { BadRequestError } from "@/lib/utils/error";
import { generateAccessToken, hashPassword } from "./auth-helpers.service";
import { UserRegisterResponse } from "./types";
import { getCredentials } from "./get-credentials.service";

export const register = async (dto: RegisterDto) => {
  const exists = await userRepo.getExistsByEmail(dto.email);

  if (exists) {
    throw new BadRequestError("User with this email already exists");
  }

  const data = {
    ...dto,
    password: await hashPassword(dto.password),
  };
  const user = await userRepo.create(data);

  const accessToken = generateAccessToken(user);
  const credentials = await getCredentials(user.id);
  const response: UserRegisterResponse = {
    accessToken,
    credentials,
  };

  return response;
};
