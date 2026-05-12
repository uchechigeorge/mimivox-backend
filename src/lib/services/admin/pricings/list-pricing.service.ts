import pricingRepo from "@/lib/repositories/pricing.repo";
import { ListPricingsMetaResponse } from "./types";
import {
  PricingListParams,
  PricingReadDto,
} from "@/lib/dtos/admin/pricing.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { pricingReadDtoValidator } from "@/lib/validators/admin/pricing.validator";

export const listPricings = async (
  params: PricingListParams,
): Promise<[PricingReadDto[], ListPricingsMetaResponse]> => {
  const [data, total] = await pricingRepo.query({
    ...params,
  });

  const dto: PricingReadDto[] = await parseArr(data, pricingReadDtoValidator);

  const meta: ListPricingsMetaResponse = {
    total,
  };

  return [dto, meta];
};
