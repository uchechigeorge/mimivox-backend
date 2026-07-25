import {
  pricingSettingGetParamsValidator,
  pricingSettingListParamsValidator,
  pricingSettingReadDtoValidator,
  pricingSettingUpdateDtoValidator,
} from "@/lib/validators/admin/pricing-setting.validator";
import z from "zod";

export type PricingSettingListParams = z.infer<
  typeof pricingSettingListParamsValidator
>;
export type PricingSettingGetParams = z.infer<
  typeof pricingSettingGetParamsValidator
>;

export type PricingSettingReadDto = z.infer<
  typeof pricingSettingReadDtoValidator
>;

export type PricingSettingUpdateDto = z.infer<
  typeof pricingSettingUpdateDtoValidator
>;
