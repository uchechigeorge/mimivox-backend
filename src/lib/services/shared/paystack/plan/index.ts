import { createPlan } from "./create-plan.service";
import { listPlans } from "./list-plans.service";
import { updatePlan } from "./update-plan.service";

const paystackPlanService = {
  listPlans,
  createPlan,
  updatePlan,
};

export default paystackPlanService;
