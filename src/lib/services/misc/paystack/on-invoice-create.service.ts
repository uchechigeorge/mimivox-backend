import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackCustomerRepo from "@/lib/repositories/paystack-customer.repo";
import userRepo from "@/lib/repositories/user.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import paystackInvoiceRepo from "@/lib/repositories/paystack-invoice.repo";
import { prisma } from "@/lib/db/prisma";

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
        subscription,
      })}`,
    );
    return;
  }

  await prisma.$transaction(async (tc) => {
    await subscriptionPaymentRepo.updateBySubscriptionId(
      subscription.id,
      {
        isCurrent: false,
      },
      tc,
    );

    const subscriptionPayment = await subscriptionPaymentRepo.create(
      {
        amount: data.amount ? data.amount / 100 : 0,
        subscriptionReference: subscription.reference,
        paymentGateway: "Paystack",
        isInitialPayment: false,
        isPaymentVerified: false,
        subscriptionId: subscription.id,
        userId: user.id,
        userName: user.fullName,
        planId: subscription.planId,
        planName: subscription.planName,
        startDate: data.period_start,
        endDate: data.period_end,
        isCurrent: true,
      },
      tc,
    );

    await paystackInvoiceRepo.create(
      {
        reference: invoiceCode,
        subscriptionPaymentId: subscriptionPayment.id,
      },
      tc,
    );
  });
};
