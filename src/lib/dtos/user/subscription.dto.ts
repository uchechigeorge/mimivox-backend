import {
  subscriptionChangePlanValidator,
  subscriptionCreateValidator,
  subscriptionGetByPaymentTokenParamsValidator,
  subscriptionReadValidator,
} from "@/lib/validators/user/subscription.validator";
import z from "zod";

export type CreateSubscriptionDto = z.infer<typeof subscriptionCreateValidator>;
export type ChangePlanSubscriptionDto = z.infer<
  typeof subscriptionChangePlanValidator
>;

export type ReadSubscriptionDto = z.infer<typeof subscriptionReadValidator>;
export type GetSubscriptionByTokenParams = z.infer<
  typeof subscriptionGetByPaymentTokenParamsValidator
>;
