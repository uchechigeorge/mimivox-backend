import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackCustomerRepo from "@/lib/repositories/paystack-customer.repo";
import userRepo from "@/lib/repositories/user.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import paystackInvoiceRepo from "@/lib/repositories/paystack-invoice.repo";
import { prisma } from "@/lib/db/prisma";
import { BadRequestError } from "@/lib/utils/error.util";

export const onInvoiceCreate = async (body: HandlePaystackWebhookDto) => {
  const data = body.data;

  if (
    !data.invoice_code ||
    !data.subscription ||
    !data.subscription.subscription_code ||
    !data.customer ||
    !data.customer.customer_code
  ) {
    console.error(
      `Paystack webhook error: Missing customer or subscription data; ${JSON.stringify(
        {
          data,
        },
      )}`,
    );
    return;
  }

  const invoiceCode = data.invoice_code;

  const paystackUser = await paystackCustomerRepo.getByReference(
    data.customer.customer_code,
  );
  if (!paystackUser || !paystackUser.userId) {
    console.error(
      `Paystack webhook error: Could not find paystack customer; ${JSON.stringify(
        {
          customer: data.customer,
        },
      )}`,
    );
    return;
  }

  const user = await userRepo.getById(paystackUser.userId);
  if (!user) {
    console.error(
      `Paystack webhook error: User not found for paystack customer; ${JSON.stringify(
        { paystackUser },
      )}`,
    );
    return;
  }

  const paystackSubscription = await paystackSubscriptionRepo.getByReference(
    data.subscription.subscription_code,
  );
  if (!paystackSubscription || !paystackSubscription.subscriptionId) {
    console.error(
      `Paystack webhook error: Paystack subscription not found; ${JSON.stringify(
        {
          plan: data.plan,
        },
      )}`,
    );
    return;
  }

  const subscription = await subscriptionRepo.getById(
    paystackSubscription.subscriptionId,
  );
  if (!subscription) {
    console.error(
      `Paystack webhook error: Subscription not found; ${JSON.stringify({
        paystackSubscription,
      })}`,
    );
    return;
  }

  const recentSubscriptionPayment =
    await subscriptionPaymentRepo.getByIsCurrentAndPending(subscription.id);

  if (!recentSubscriptionPayment) {
    console.error(
      `Paystack webhook error: Recent invoice not found; ${JSON.stringify({
        subscription,
      })} | [invoice.create]`,
    );
    throw new BadRequestError(
      "Paystack webhook error: Recent invoice not found; [invoice.create]",
    );
  }

  await prisma.$transaction(async (tc) => {
    await paystackInvoiceRepo.create(
      {
        reference: invoiceCode,
        subscriptionPaymentId: recentSubscriptionPayment.id,
      },
      tc,
    );
  });
};
