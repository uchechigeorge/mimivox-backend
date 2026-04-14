import { PlanGetParams, PlanReadDto } from "@/lib/dtos/user/plan.dto";
import planRepo from "@/lib/repositories/plan.repo";
import { UserAuthItems } from "@/lib/types";
import { NotFoundError } from "@/lib/utils/error.util";
import { planReadDtoValidator } from "@/lib/validators/user/plan.validator";

export const getPlan = async (
  params: PlanGetParams,
  authItems: UserAuthItems,
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
