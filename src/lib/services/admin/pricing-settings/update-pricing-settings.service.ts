import {
  PricingSettingReadDto,
  PricingSettingUpdateDto,
} from "@/lib/dtos/admin/pricing-setting.dto";
import pricingRepo from "@/lib/repositories/pricing.repo";
import pricingSettingRepo from "@/lib/repositories/pricing-setting.repo";
import { applySettingChangeToUsers } from "./apply-to-users.service";
import { NotFoundError } from "@/lib/utils/error.util";
import { pricingSettingReadDtoValidator } from "@/lib/validators/admin/pricing-setting.validator";

export const updatePricingSetting = async (
  id: string,
  updateDto: PricingSettingUpdateDto,
): Promise<PricingSettingReadDto> => {
  const pricingSetting = await pricingSettingRepo.getById(id);
  if (!pricingSetting) {
    throw new NotFoundError("Pricing setting not found");
  }

  const updatedPricingSetting = await pricingSettingRepo.update(id, updateDto);

  // Existing users keep the old limits until renewal unless we apply the change now
  const pricing = await pricingRepo.getById(pricingSetting.pricingId);
  await applySettingChangeToUsers(
    pricingSetting,
    updatedPricingSetting,
    !!pricing?.isFree,
  );

  const readDto = await pricingSettingReadDtoValidator.parseAsync(
    updatedPricingSetting,
  );
  return readDto;
};
