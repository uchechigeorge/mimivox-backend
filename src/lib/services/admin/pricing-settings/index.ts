import { getPricingSetting } from "./get-pricing-settings.service";
import { listPricingSettings } from "./list-pricing-settings.service";
import { updatePricingSetting } from "./update-pricing-settings.service";

const pricingSettingsService = {
  listPricingSettings,
  getPricingSetting,
  updatePricingSetting,
};

export default pricingSettingsService;
