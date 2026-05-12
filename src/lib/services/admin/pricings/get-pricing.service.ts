import { PricingGetParams, PricingReadDto } from "@/lib/dtos/admin/pricing.dto";
import pricingRepo from "@/lib/repositories/pricing.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { pricingReadDtoValidator } from "@/lib/validators/admin/pricing.validator";

export const getPricing = async (
  params: PricingGetParams,
  authItems: AdminAuthItems,
): Promise<PricingReadDto> => {
  const [data, total] = await pricingRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await pricingReadDtoValidator.parseAsync(data[0]);

  return dto;
};
