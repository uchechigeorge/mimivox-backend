import { PlanGetParams, PlanReadDto } from "@/lib/dtos/admin/plan.dto";
import planRepo from "@/lib/repositories/plan.repo";
import { AdminAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { planReadDtoValidator } from "@/lib/validators/admin/plan.validator";

export const getPlan = async (
  params: PlanGetParams,
  authItems: AdminAuthItems,
): Promise<PlanReadDto> => {
  const [data, total] = await planRepo.query(
    {
      id: params.id,
    },
    { includeRelations: true },
  );
  if (total < 1) throw new NotFoundError();

  const dto = await planReadDtoValidator.parseAsync(data[0]);

  return dto;
};
