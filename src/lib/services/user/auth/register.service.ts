import { RegisterDto } from "@/lib/dtos/user/auth.dto";
import userRepo from "@/lib/repositories/user.repo";
import { BadRequestError } from "@/lib/utils/error";
import { generateAccessToken, hashPassword } from "./auth-helpers.service";
import { UserRegisterResponse } from "./types";
import { getCredentials } from "./get-credentials.service";
import planSettingRepo from "@/lib/repositories/plan-setting.repo";
import planRepo from "@/lib/repositories/plan.repo";
import { UserCreateArgs } from "@/generated/prisma/models";

export const register = async (dto: RegisterDto) => {
  const exists = await userRepo.getExistsByEmail(dto.email);

  if (exists) {
    throw new BadRequestError("User with this email already exists");
  }

  const freePlan = await planRepo.getByIsFree();
  if (!freePlan) {
    throw new BadRequestError("Free plan not found");
  }
  const freePlanSettings = await planSettingRepo.getByPlanId(freePlan.id);
  if (!freePlanSettings) {
    throw new BadRequestError("Free plan settings not found");
  }

  const data: UserCreateArgs["data"] = {
    ...dto,
    password: await hashPassword(dto.password),
    noOfCharactersAllocated: freePlanSettings.noOfCharacters,
    noOfCharactersLeft: freePlanSettings.noOfCharacters,
    noOfVoicesAllocated: freePlanSettings.noOfVoices,
    noOfVoicesLeft: freePlanSettings.noOfVoices,
    noOfWordsAllowed: freePlanSettings.noOfWords,
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
