import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import paystackPlanRepo from "@/lib/repositories/paystack-pricing.repo";
import pricingRepo from "@/lib/repositories/pricing.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";
import paystackSubscriptionService from "../../shared/paystack/subscriptions";
import { prisma } from "@/lib/db/prisma";
import paystackSubscriptionRepo from "@/lib/repositories/paystack-subscription.repo";
import subscriptionPaymentRepo from "@/lib/repositories/subscription-payment.repo";
import paystackCustomerRepo from "@/lib/repositories/paystack-customer.repo";
import { email } from "zod";

export const handleSubscriptionPayment = async (
  body: HandlePaystackWebhookDto,
) => {
  const data = body.data;
  const metadata = data.metadata;
  // Validate metadata
  if (metadata?.type !== "SubscriptionPayment" || !metadata.paymentToken) {
    console.error(
      `Paystack webhook error: Invalid metadata for subscription payment; ${JSON.stringify(
        { metadata },
      )}`,
    );
    return;
  }

  // Validate customer info
  if (!data.customer || !data.customer.customer_code || !data.customer.email) {
    console.error(
      `Paystack webhook error: Missing customer information in payment data; ${JSON.stringify(
        { data },
      )}`,
    );
    return;
  }

  // Get subscription by payment token
  const subscription = await subscriptionRepo.getByPaymentToken(
    metadata.paymentToken,
  );
  if (!subscription) {
    console.error(
      `Paystack webhook error: Subscription not found;
      ${JSON.stringify({ paymentToken: metadata.paymentToken })}
    `,
    );
    return;
  }

  if (subscription.paymentVerified) {
    console.error(
      `Paystack webhook error: Payment already verified. ${JSON.stringify({
        subscription,
      })}`,
    );
    return;
  }

  // Get user and subscription pricing
  const user = await userRepo.getById(subscription.userId);
  if (!user) {
    console.error(
      `Paystack webhook error: User not found for subscription;
      ${JSON.stringify({ subscription })}`,
    );
    return;
  }

  const pricing = await pricingRepo.getById(subscription.pricingId);
  if (!pricing) {
    console.error(
      `Paystack webhook error: Subscription pricing not found for subscription;
      ${JSON.stringify({ subscription })}`,
    );
    return;
  }

  const paystackPlan = await paystackPlanRepo.getByPricingId(pricing.id);
  if (!paystackPlan) {
    console.error(
      `Paystack webhook error: Paystack pricing not found for subscription pricing;
      ${JSON.stringify({ pricing })}`,
    );
    return;
  }

  // Validate amount paid
  // Paystack sends amount in kobo (for NGN) or pesewas (for GHS), so we divide by 100 to get the amount in the main currency unit
  const amountPaid = Number(data.amount ? data.amount / 100 : 0);
  const price = paystackPlan.amount.toNumber() / 100;

  if (price > amountPaid) {
    console.error(
      `Paystack webhook error: Subscription amount mismatch; Expected: ${price}, Received: ${amountPaid}`,
    );
    return;
  }

  // Validate subscription status
  if (subscription.status !== "Pending") {
    console.error(
      `Paystack webhook error: Subscription is not pending. ${JSON.stringify({
        subscription,
      })}`,
    );
    return;
  }

  // Create paystack subscription
  var [paystackSubscription, paystackSubscriptionError] =
    await paystackSubscriptionService.createSubscription({
      plan: paystackPlan.reference,
      customer: data.customer.customer_code,
      authorization: data.authorization?.authorization_code ?? undefined,
    });
  if (!paystackSubscription || paystackSubscriptionError) {
    console.error(
      `Paystack webhook error: Failed to create paystack subscription; ${JSON.stringify(
        {
          data,
          paystackSubscriptionError,
        },
      )}`,
    );
    return;
  }

  // Get currency and exchange rate
  const currency = data.currency?.toLowerCase() ?? null;

  let paystackCustomer = await paystackCustomerRepo.getByEmail(
    data.customer.email ?? "",
  );
  const pSub = paystackSubscription;
  const bCus = {
    ...data.customer,
    email: data.customer.email,
    customer_code: data.customer.customer_code,
  }; // customer from webhook data/body
  await prisma.$transaction(async (tx) => {
    // Update subscription, invoice, transaction, and user
    await userRepo.update(
      user.id,
      {
        hasActiveSubscription: true,
      },
      tx,
    );

    await subscriptionRepo.update(
      subscription.id,
      {
        paymentVerified: true,
        isActive: true,
        status: "WillRenew",
        paymentGateway: "Paystack",
      },
      tx,
    );

    await paystackSubscriptionRepo.create(
      {
        reference: pSub.subscription_code,
        subscriptionId: subscription.id,
      },
      tx,
    );

    await subscriptionPaymentRepo.create(
      {
        amount: amountPaid,
        subscriptionReference: subscription.reference,
        paymentGateway: "Paystack",
        isInitialPayment: true,
        isPaymentVerified: true,
        paidAt: new Date(),
        subscriptionId: subscription.id,
        currency,
      },
      tx,
    );

    if (!paystackCustomer) {
      await paystackCustomerRepo.create(
        {
          userId: user.id,
          email: bCus.email,
          reference: bCus.customer_code,
        },
        tx,
      );
    } else {
      await paystackCustomerRepo.update(
        paystackCustomer.id,
        {
          email: bCus.email,
          reference: bCus.customer_code,
        },
        tx,
      );
    }
  });
};
