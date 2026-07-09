import { HandlePaystackWebhookHeader } from "@/lib/dtos/misc/paystack.dto";
import {
  nBoolean,
  normalizeOptional,
  rString,
  stringToNullableDate,
} from "@/lib/utils/zod.utils";
import z from "zod";

export const handlePaystackWebhookDto = z.object({
  event: rString,
  data: z.object({
    domain: z.string().nullish(),
    amount: z.coerce.number().nullish(),
    currency: z.string().nullish(),
    metadata: z
      .object({
        type: normalizeOptional(
          z.enum(["None", "SubscriptionPayment", "OneTimePayment"]),
        ),
        paymentToken: z.string().nullish(),
      })
      .nullish(),
    subscription_code: z.string().nullish(),
    invoice_code: z.string().nullish(),
    next_payment_date: stringToNullableDate,
    period_start: stringToNullableDate,
    period_end: stringToNullableDate,
    paid: nBoolean,
    paid_at: stringToNullableDate,
    status: z.string().nullish(),
    description: z.string().nullish(),
    customer: z
      .object({
        first_name: z.string().nullish(),
        last_name: z.string().nullish(),
        email: z.string().nullish(),
        customer_code: z.string().nullish(),
      })
      .nullish(),
    plan: z
      .object({
        name: z.string().nullish(),
        plan_code: z.string().nullish(),
        amount: z.coerce.number().nullish(),
      })
      .nullish(),
    subscription: z
      .object({
        subscription_code: z.string().nullish(),
        next_payment_date: stringToNullableDate,
        amount: z.coerce.number(),
        status: z.string().nullish(),
      })
      .nullish(),
    authorization: z
      .object({
        authorization_code: z.string().nullish(),
      })
      .nullish(),
  }),
});

export const getHeaders = async (
  req: Request,
): Promise<HandlePaystackWebhookHeader> => {
  const cloneRes = req.clone();

  return {
    signature: req.headers.get("X-Paystack-Signature"),
    bodyString: JSON.stringify(await cloneRes.json()),
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
