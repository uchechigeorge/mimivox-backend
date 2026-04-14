import {
  planGetParamsValidator,
  planListParamsValidator,
  planReadDtoValidator,
} from "@/lib/validators/admin/plan.validator";
import z from "zod";

export type PlanListParams = z.infer<typeof planListParamsValidator>;
export type PlanGetParams = z.infer<typeof planGetParamsValidator>;

export type PlanReadDto = z.infer<typeof planReadDtoValidator>;
