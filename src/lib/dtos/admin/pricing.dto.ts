import { pricingUpdateDtoValidator } from "@/lib/validators/admin/pricing.validator";
import {
  pricingGetParamsValidator,
  pricingListParamsValidator,
  pricingReadDtoValidator,
} from "@/lib/validators/admin/pricing.validator";
import z from "zod";

export type PricingListParams = z.infer<typeof pricingListParamsValidator>;
export type PricingGetParams = z.infer<typeof pricingGetParamsValidator>;

export type PricingReadDto = z.infer<typeof pricingReadDtoValidator>;

export type PricingUpdateDto = z.infer<typeof pricingUpdateDtoValidator>;
