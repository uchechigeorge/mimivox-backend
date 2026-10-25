import {
  expireTopUpCredits,
  getExpiringTopUpCredits,
  topUpCredits,
} from "./top-up-credits.service";

const pricingSettingsService = {
  topUpCredits,
  expireTopUpCredits,
  getExpiringTopUpCredits,
};

export default pricingSettingsService;
