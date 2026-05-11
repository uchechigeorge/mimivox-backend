import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";

export const handleOneTimePayment = async (body: HandlePaystackWebhookDto) => {
  const data = body.data;
  const metadata = data.metadata;

  if (metadata?.type !== "OneTimePayment" || !metadata.paymentToken) {
    console.error(
      `Paystack webhook error: Invalid metadata for one-time payment; ${JSON.stringify(
        { metadata },
      )}`,
    );
    return;
  }

  // GET resource to be paid for by payment token

  // Get currency used; use 1000 as default exchange rate

  // Get amout to pay and amout paid

  // Check if amount paid is sufficient

  // Check if payment is already verified

  // Update resource's payment record

  // If exists, create transaction record for the payment

  // Send notification
};
