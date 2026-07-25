import pricingSettingRepo from "@/lib/repositories/pricing-setting.repo";
import {
  PricingSettingListParams,
  PricingSettingReadDto,
} from "@/lib/dtos/admin/pricing-setting.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { pricingSettingReadDtoValidator } from "@/lib/validators/admin/pricing-setting.validator";
import { ListPricingSettingsMetaResponse } from "./types";

export const listPricingSettings = async (
  params: PricingSettingListParams,
): Promise<[PricingSettingReadDto[], ListPricingSettingsMetaResponse]> => {
  const [data, total] = await pricingSettingRepo.query(params, {
    includeRelations: true,
  });

  const dto: PricingSettingReadDto[] = await parseArr(
    data,
    pricingSettingReadDtoValidator,
  );

  const meta: ListPricingSettingsMetaResponse = {
    total,
  };

  return [dto, meta];
};
