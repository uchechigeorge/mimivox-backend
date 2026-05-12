import { getPricing } from "./get-pricing.service";
import { listPricings } from "./list-pricing.service";
import { updatePricing } from "./update-pricing.service";

const pricingService = {
  listPricings,
  getPricing,
  updatePricing,
};

export default pricingService;
