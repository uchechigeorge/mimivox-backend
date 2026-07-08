import { env } from "@/lib/config/env.config";
import {
  HandlePaystackWebhookDto,
  HandlePaystackWebhookHeader,
} from "@/lib/dtos/misc/paystack.dto";
import crypto from "crypto";
import { onChargeSuccess } from "./on-charge-success.service";
import { onSubscriptionCreate } from "./on-subscription-create.service";
import { onSubscriptionNotRenew } from "./on-subscription-not-renew.service";
import { onSubscriptionDisable } from "./on-subscription-disable.service";
import { onInvoicePaymentFailed } from "./on-invoice-payment-failed.service";
import { onInvoiceCreate } from "./on-invoice-create.service";
import { onInvoiceUpdate } from "./on-invoice-update.service";

export const handleWebhook = async (
  body: HandlePaystackWebhookDto,
  headers: HandlePaystackWebhookHeader,
) => {
  const ignoreAuth = env.PAYSTACK_IGNORE_WEBHOOK_AUTH;

  const signature = headers.signature;
  const paystackSecretKey = env.PAYSTACK_SECRET_KEY ?? "";

  const hash = crypto
    .createHmac("sha512", paystackSecretKey)
    .update(headers.bodyString)
    .digest("hex");
  const validIPs = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];

  const currentIp = headers.ipAddress;

  console.error({ currentIp, signature, hash });

  // Optionally skip signature hash and ip check; for dev mode
  if (ignoreAuth === false) {
    if (signature != hash) {
      console.error(
        `Paystack webhook error: Invalid hash;
          ${JSON.stringify({ hash, signature })}`,
      );

      return "Invalid hash";
    }

    if (!validIPs.some((ip) => ip == currentIp)) {
      console.error(
        `Paystack webhook error: Invalid IP;
          ${JSON.stringify({ currentIp, validIPs })}`,
      );

      return "Invalid IP";
    }
  }

  console.error(`Paystack webhook received: ${JSON.stringify(body)}`);

  if (body.event === "charge.success") {
    await onChargeSuccess(body);
  }
  // Handle subscription creation event
  else if (body.event === "subscription.create") {
    await onSubscriptionCreate(body);
  }
  // Handle subscription cancellation
  else if (body.event === "subscription.disable") {
    await onSubscriptionDisable(body);
  }
  // Handle subscription future cancellation
  else if (body.event === "subscription.not_renew") {
    await onSubscriptionNotRenew(body);
  }
  // Handle invoice create event
  else if (body.event === "invoice.create") {
    await onInvoiceCreate(body);
  }
  // Handle invoice update event
  else if (body.event === "invoice.update") {
    await onInvoiceUpdate(body);
  }
  // Handle subscription payment failure
  else if (body.event === "invoice.payment_failed") {
    await onInvoicePaymentFailed(body);
  }
  // Default
  else {
    console.warn(
      `Paystack webhook warning: Unhandled event type: ${body.event}`,
    );
  }
};
