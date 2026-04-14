import { getPlan } from "./get-plan.service";
import { listPlans } from "./list-plans.service";

const planService = {
  listPlans,
  getPlan,
};

export default planService;
