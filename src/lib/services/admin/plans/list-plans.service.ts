import planRepo from "@/lib/repositories/plan.repo";
import { ListPlansMetaResponse } from "./types";
import { PlanListParams, PlanReadDto } from "@/lib/dtos/admin/plan.dto";
import { parseArr } from "@/lib/utils/zod.utils";
import { planReadDtoValidator } from "@/lib/validators/admin/plan.validator";

export const listPlans = async (
  params: PlanListParams,
): Promise<[PlanReadDto[], ListPlansMetaResponse]> => {
  const [data, total] = await planRepo.query(
    {
      ...params,
    },
    { includeRelations: true },
  );

  const dto: PlanReadDto[] = await parseArr(data, planReadDtoValidator);

  const meta: ListPlansMetaResponse = {
    total,
  };

  return [dto, meta];
};
