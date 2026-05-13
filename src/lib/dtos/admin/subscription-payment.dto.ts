import {
  subscriptionPaymentGetParamsValidator,
  subscriptionPaymentListParamsValidator,
  subscriptionPaymentReadDtoValidator,
} from "@/lib/validators/admin/subscription-payment.validator";
import z from "zod";

export type SubscriptionPaymentListParams = z.infer<
  typeof subscriptionPaymentListParamsValidator
>;

export type SubscriptionPaymentGetParams = z.infer<
  typeof subscriptionPaymentGetParamsValidator
>;

export type SubscriptionPaymentReadDto = z.infer<
  typeof subscriptionPaymentReadDtoValidator
>;
