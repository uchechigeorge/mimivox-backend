import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackCustomerRepo from "@/lib/repositories/paystack-customer.repo";
import userRepo from "@/lib/repositories/user.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";
import { sendSubscriptionPaymentFailed } from "../../user/notifications/subscription-payment-failed.service";
import paystackInvoiceRepo from "@/lib/repositories/paystack-invoice.repo";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";

export const onInvoicePaymentFailed = async (
  body: HandlePaystackWebhookDto,
) => {
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
      )} [invoice.payment_failed]`,
    );
    return;
  }

  const paystackUser = await paystackCustomerRepo.getByReference(
    data.customer.customer_code,
  );
  if (!paystackUser || !paystackUser.userId) {
    console.error(
      `Paystack webhook error: Could not find paystack customer; ${JSON.stringify(
        {
          customer: data.customer,
        },
      )} [invoice.payment_failed]`,
    );
    return;
  }

  const user = await userRepo.getById(paystackUser.userId);
  if (!user) {
    console.error(
      `Paystack webhook error: User not found for paystack customer; ${JSON.stringify(
        { paystackUser },
      )} [invoice.payment_failed]`,
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
      )} [invoice.payment_failed]`,
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
      })} [invoice.payment_failed]`,
    );
    return;
  }

  const paystackInvoice = await paystackInvoiceRepo.getByReference(
    data.invoice_code,
  );
  if (!paystackInvoice || !paystackInvoice.subscriptionPaymentId) {
    let subscriptionPayment =
      await subscriptionPaymentRepo.getByIsCurrentAndPending(subscription.id);
    if (!subscriptionPayment) {
      subscriptionPayment = await subscriptionPaymentRepo.create({
        amount: data.amount ? data.amount / 100 : 0,
        subscriptionReference: subscription.reference,
        paymentGateway: "Paystack",
        isInitialPayment: false,
        isPaymentVerified: data.paid,
        paidAt: data.paid_at,
        subscriptionId: subscription.id,
        status: data.status == "success" ? "Paid" : "Failed",
        userId: user.id,
        userName: user.fullName,
        planId: subscription.planId,
        planName: subscription.planName,
        startDate: data.period_start,
        endDate: data.period_end,
        isCurrent: true,
      });
    }

    await paystackInvoiceRepo.create({
      reference: data.invoice_code,
      subscriptionPaymentId: subscriptionPayment.id,
    });
  } else {
    const subscriptionPayment = await subscriptionPaymentRepo.getById(
      paystackInvoice.subscriptionPaymentId,
    );
    if (subscriptionPayment) {
      await subscriptionPaymentRepo.update(subscriptionPayment.id, {
        isPaymentVerified: data.paid,
        status: data.status == "success" ? "Paid" : "Failed",
      });
    }
  }

  if (data.subscription.status === "attention") {
    await subscriptionRepo.update(subscription.id, {
      status: "PastDue",
    });
  }

  await sendSubscriptionPaymentFailed(user.email, {
    userName: user.fullName,
    amount: data.amount ? data.amount / 100 : 0,
    planName: subscription.planName,
    retryDate: null,
  });
};
