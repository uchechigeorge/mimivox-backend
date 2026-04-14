import { RegisterDto } from "@/lib/dtos/user/auth.dto";
import userRepo from "@/lib/repositories/user.repo";
import { BadRequestError } from "@/lib/utils/error.util";
import { generateAccessToken, hashPassword } from "./auth-helpers.service";
import { UserRegisterResponse } from "./types";
import { getCredentials } from "./get-credentials.service";
import planSettingRepo from "@/lib/repositories/plan-setting.repo";
import planRepo from "@/lib/repositories/plan.repo";
import { UserCreateArgs } from "@/generated/prisma/models";
import { randomColor } from "@/lib/utils/constants.utils";

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
    defaultBg: randomColor,
    password: await hashPassword(dto.password),
    noOfCreditsAllocated: freePlanSettings.noOfCredits,
    noOfCreditsLeft: freePlanSettings.noOfCredits,
    noOfCharactersAllocated: freePlanSettings.noOfCharacters,
    noOfCharactersLeft: freePlanSettings.noOfCharacters,
    noOfWordsAllowed: freePlanSettings.noOfWords,
    noOfVoicesAllocated: freePlanSettings.noOfVoices,
    noOfVoicesLeft: freePlanSettings.noOfVoices,
    noOfPremiumVoicesAllocated: freePlanSettings.noOfPremiumVoices,
    noOfPremiumVoicesLeft: freePlanSettings.noOfPremiumVoices,
    noOfCloneVoicesAllocated: freePlanSettings.noOfCloneVoices,
    noOfCloneVoicesLeft: freePlanSettings.noOfCloneVoices,
    noOfImagesAllocated: freePlanSettings.noOfImages,
    noOfImagesLeft: freePlanSettings.noOfImages,
    noOfMusicAllocated: freePlanSettings.noOfMusic,
    noOfMusicLeft: freePlanSettings.noOfMusic,
    noOfVideosAllocated: freePlanSettings.noOfVideos,
    noOfVideosLeft: freePlanSettings.noOfVideos,
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
