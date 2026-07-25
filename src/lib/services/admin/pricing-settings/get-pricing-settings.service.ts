import {
  PricingSettingGetParams,
  PricingSettingReadDto,
} from "@/lib/dtos/admin/pricing-setting.dto";
import pricingSettingRepo from "@/lib/repositories/pricing-setting.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { pricingSettingReadDtoValidator } from "@/lib/validators/admin/pricing-setting.validator";

export const getPricingSetting = async (
  params: PricingSettingGetParams,
  authItems: AdminAuthItems,
): Promise<PricingSettingReadDto> => {
  const [data, total] = await pricingSettingRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await pricingSettingReadDtoValidator.parseAsync(data[0]);

  return dto;
};
