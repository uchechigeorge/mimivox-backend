import { HandlePaystackWebhookHeader } from "@/lib/dtos/misc/paystack.dto";
import {
  normalizeOptional,
  rString,
  stringToNullableDate,
} from "@/lib/utils/zod.utils";
import z from "zod";

export const handlePaystackWebhookDto = z.object({
  event: rString,
  data: z.object({
    amount: z.coerce.number().optional(),
    currency: z.string().optional(),
    metadata: z
      .object({
        type: normalizeOptional(
          z.enum(["None", "SubscriptionPayment", "OneTimePayment"]),
        ),
        paymentToken: z.string().optional(),
      })
      .optional(),
    subscription_code: z.string().optional(),
    next_payment_date: stringToNullableDate,
    period_start: stringToNullableDate,
    period_end: stringToNullableDate,
    customer: z
      .object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        email: z.string().optional(),
        customer_code: z.string().optional(),
      })
      .optional(),
    plan: z
      .object({
        name: z.string().optional(),
        plan_code: z.string().optional(),
        amount: z.coerce.number(),
      })
      .optional(),
    subscription: z
      .object({
        subscription_code: z.string().optional(),
        next_payment_date: stringToNullableDate,
        amount: z.coerce.number(),
        status: z.string().optional(),
      })
      .optional(),
    authorization: z
      .object({
        authorization_code: z.string().optional(),
      })
      .optional(),
  }),
});

export const getHeaders = (req: Request): HandlePaystackWebhookHeader => {
  const cloneRes = req.clone();
  return {
    signature: req.headers.get("X-Paystack-Signature"),
    bodyString: JSON.stringify(cloneRes.json()),
    ipAddress: getIp(req),
  };
};

const getIp = (req: Request) => {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }

  return req.headers.get("x-real-ip") || "127.0.0.1";
};
