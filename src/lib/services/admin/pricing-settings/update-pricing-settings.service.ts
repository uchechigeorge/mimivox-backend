import {
  PricingSettingReadDto,
  PricingSettingUpdateDto,
} from "@/lib/dtos/admin/pricing-setting.dto";
import pricingSettingRepo from "@/lib/repositories/pricing-setting.repo";
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

  const readDto = await pricingSettingReadDtoValidator.parseAsync(
    updatedPricingSetting,
  );
  return readDto;
};
