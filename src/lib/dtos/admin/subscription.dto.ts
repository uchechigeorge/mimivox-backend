import {
  subscriptionExtendParamsValidator,
  subscriptionGetParamsValidator,
  subscriptionListParamsValidator,
  subscriptionReadDtoValidator,
} from "@/lib/validators/admin/subscription.validator";
import z from "zod";

export type SubscriptionListParams = z.infer<
  typeof subscriptionListParamsValidator
>;

export type SubscriptionExtendParams = z.infer<
  typeof subscriptionExtendParamsValidator
>;

export type SubscriptionGetParams = z.infer<
  typeof subscriptionGetParamsValidator
>;

export type SubscriptionReadDto = z.infer<typeof subscriptionReadDtoValidator>;
