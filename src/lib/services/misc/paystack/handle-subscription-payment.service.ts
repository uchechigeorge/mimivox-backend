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
import { UserUpdateArgs } from "@/generated/prisma/models";
import {
  PaystackSubscription,
  PlanSetting,
  Subscription,
  User,
} from "@/generated/prisma/client";
import planSettingRepo from "@/lib/repositories/plan-setting.repo";
import { BadRequestError } from "@/lib/utils/error.util";
import paystackService from "../../shared/paystack";
import { PaystackSubscription as PaystackSub } from "../../shared/paystack/subscriptions/types";

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
      start_date: !subscription.isDowngrade
        ? undefined
        : subscription.nextBillingDate,
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

  // If has previous subscription, disable it
  // Get previous subscription and paystack subscription reference
  let previousSubscription: Subscription | null = null;
  let previousPaystackSubscription: PaystackSub | null = null;
  if (subscription.previousSubscriptionId != null) {
    previousSubscription = await subscriptionRepo.getById(
      subscription.previousSubscriptionId,
    );
    if (!previousSubscription)
      throw new BadRequestError("Previous subscription not found");

    const previousPaystackSubscriptionRef =
      await paystackSubscriptionRepo.getBySubscriptionId(
        previousSubscription.id,
      );
    if (!previousPaystackSubscriptionRef)
      throw new BadRequestError("Paystack previous subscription not found");

    const [paystackRes, paystackFetchErr] =
      await paystackService.subscription.fetchSubscription(
        previousPaystackSubscriptionRef.reference,
      );
    if (paystackFetchErr)
      throw new BadRequestError("Paystack previous subscription not found");
    previousPaystackSubscription = paystackRes;
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

    const planSettings = await planSettingRepo.getByPlanId(pricing.planId, tx);
    const userSettings = getUserSettings(planSettings, user);
    await userRepo.update(
      user.id,
      {
        ...userSettings,
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

    if (previousSubscription) {
      await subscriptionRepo.update(
        previousSubscription.id,
        {
          isActive: false,
          status: "NonRenewing",
          endDate: previousSubscription.nextBillingDate,
        },
        tx,
      );
    }

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
        userId: user.id,
        userName: user.fullName,
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

  if (previousPaystackSubscription) {
    await paystackService.subscription.disableSubscription({
      code: previousPaystackSubscription.subscription_code,
      token: previousPaystackSubscription.email_token,
    });
  }
};

export const getUserSettings = (
  planSettings: PlanSetting | null,
  user: User,
) => {
  if (!planSettings) return {};

  user.noOfCreditsAllocated;

  const settings: UserUpdateArgs["data"] = {
    noOfCreditsUsed: 0,
    noOfCreditsAllocated: !planSettings.noOfCredits
      ? null
      : planSettings.noOfCredits + (user.noOfCreditsAllocated ?? 0),
    noOfCreditsLeft: !planSettings.noOfCredits
      ? null
      : planSettings.noOfCredits + (user.noOfCreditsAllocated ?? 0),
    noOfCharactersUsed: 0,
    noOfCharactersAllocated: !planSettings.noOfCharacters
      ? null
      : planSettings.noOfCharacters + (user.noOfCharactersAllocated ?? 0),
    noOfCharactersLeft: !planSettings.noOfCharacters
      ? null
      : planSettings.noOfCharacters + (user.noOfCharactersAllocated ?? 0),
    noOfWordsAllowed: planSettings.noOfWords,
    noOfVoicesUsed: 0,
    noOfVoicesAllocated: !planSettings.noOfVoices
      ? null
      : planSettings.noOfVoices + (user.noOfVoicesAllocated ?? 0),
    noOfVoicesLeft: !planSettings.noOfVoices
      ? null
      : planSettings.noOfVoices + (user.noOfVoicesAllocated ?? 0),
    noOfPremiumVoicesUsed: 0,
    noOfPremiumVoicesAllocated: !planSettings.noOfPremiumVoices
      ? null
      : planSettings.noOfPremiumVoices + (user.noOfPremiumVoicesAllocated ?? 0),
    noOfPremiumVoicesLeft: !planSettings.noOfPremiumVoices
      ? null
      : planSettings.noOfPremiumVoices + (user.noOfPremiumVoicesAllocated ?? 0),
    noOfCloneVoicesUsed: 0,
    noOfCloneVoicesAllocated: !planSettings.noOfCloneVoices
      ? null
      : planSettings.noOfCloneVoices + (user.noOfCloneVoicesAllocated ?? 0),
    noOfCloneVoicesLeft: !planSettings.noOfCloneVoices
      ? null
      : planSettings.noOfCloneVoices + (user.noOfCloneVoicesAllocated ?? 0),
    noOfImagesUsed: 0,
    noOfImagesAllocated: !planSettings.noOfImages
      ? null
      : planSettings.noOfImages + (user.noOfImagesAllocated ?? 0),
    noOfImagesLeft: !planSettings.noOfImages
      ? null
      : planSettings.noOfImages + (user.noOfImagesAllocated ?? 0),
    noOfMusicUsed: 0,
    noOfMusicAllocated: !planSettings.noOfMusic
      ? null
      : planSettings.noOfMusic + (user.noOfMusicAllocated ?? 0),
    noOfMusicLeft: !planSettings.noOfMusic
      ? null
      : planSettings.noOfMusic + (user.noOfMusicAllocated ?? 0),
    noOfVideosUsed: 0,
    noOfVideosAllocated: !planSettings.noOfVideos
      ? null
      : planSettings.noOfVideos + (user.noOfVideosAllocated ?? 0),
    noOfVideosLeft: !planSettings.noOfVideos
      ? null
      : planSettings.noOfVideos + (user.noOfVideosAllocated ?? 0),
  };

  return settings;
};
