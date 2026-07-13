import { RegisterDto } from "@/lib/dtos/user/auth.dto";
import userRepo from "@/lib/repositories/user.repo";
import { BadRequestError } from "@/lib/utils/error.util";
import { generateAccessToken, hashPassword } from "./auth-helpers.service";
import { UserRegisterResponse } from "./types";
import { getCredentials } from "./get-credentials.service";
import { UserCreateArgs } from "@/generated/prisma/models";
import { randomColor } from "@/lib/utils/constants.utils";
import pricingRepo from "@/lib/repositories/pricing.repo";
import pricingSettingRepo from "@/lib/repositories/pricing-setting.repo";
import pricingSettingsService from "../../shared/pricing-settings";

export const register = async (dto: RegisterDto) => {
  const exists = await userRepo.getExistsByEmail(dto.email);

  if (exists) {
    throw new BadRequestError("User with this email already exists");
  }

  const freePricing = await pricingRepo.getByIsFree();
  if (!freePricing) {
    throw new BadRequestError("Free pricing not found");
  }
  const freePricingSettings = await pricingSettingRepo.getByPricingId(
    freePricing.id,
  );
  if (!freePricingSettings) {
    throw new BadRequestError("Free pricing settings not found");
  }

  const userSettings = pricingSettingsService.topUpCredits(freePricingSettings);

  const data: UserCreateArgs["data"] = {
    ...userSettings,
    ...dto,
    defaultBg: randomColor,
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
