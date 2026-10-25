import { prisma } from "@/lib/db/prisma";
import { HandlePaystackWebhookDto } from "@/lib/dtos/misc/paystack.dto";
import creditPurchaseRepo from "@/lib/repositories/credit-purchase.repo";
import subscriptionRepo from "@/lib/repositories/subscription.repo";
import userRepo from "@/lib/repositories/user.repo";

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

  const purchase = await creditPurchaseRepo.getByPaymentToken(
    metadata.paymentToken,
  );
  if (!purchase) {
    console.error(
      `Paystack webhook error: Credit purchase not found; ${JSON.stringify({
        paymentToken: metadata.paymentToken,
      })}`,
    );
    return;
  }

  if (purchase.paymentVerified || purchase.status !== "Pending") {
    console.error(
      `Paystack webhook error: Credit purchase already processed; ${JSON.stringify(
        { id: purchase.id, status: purchase.status },
      )}`,
    );
    return;
  }

  // Paystack sends the lowest currency unit, so divide by 100
  const amountPaid = Number(data.amount ? data.amount / 100 : 0);
  const price = purchase.amount.toNumber();
  if (price > amountPaid) {
    console.error(
      `Paystack webhook error: Credit purchase amount mismatch; Expected: ${price}, Received: ${amountPaid}`,
    );
    return;
  }

  await prisma.$transaction(async (tx) => {
    const claim = await creditPurchaseRepo.claimPendingPayment(purchase.id, tx);
    if (claim.count !== 1) return;

    const user = await userRepo.getByIdWithLock(purchase.userId, tx);
    if (!user) {
      throw new Error("User not found for credit purchase");
    }

    // Top up credits only expire with a plan period, so they need a live subscription
    const hasActiveSubscription =
      purchase.type === "TopUp" &&
      (await subscriptionRepo.getExistsByUserIdAndIsActive(user.id, true, tx));
    const expiresWithPlan = purchase.type === "TopUp" && hasActiveSubscription;

    // A null balance means unlimited credits, so there is nothing to add to
    await userRepo.update(
      user.id,
      {
        noOfCreditsAllocated:
          user.noOfCreditsAllocated == null
            ? null
            : user.noOfCreditsAllocated + purchase.noOfCredits,
        noOfCreditsLeft:
          user.noOfCreditsLeft == null
            ? null
            : user.noOfCreditsLeft + purchase.noOfCredits,
        ...(expiresWithPlan && {
          noOfTopUpCreditsLeft:
            user.noOfTopUpCreditsLeft + purchase.noOfCredits,
        }),
      },
      tx,
    );

    await creditPurchaseRepo.update(
      purchase.id,
      {
        status: "Paid",
        paymentGateway: "Paystack",
        amountPaid,
        currency: data.currency?.toLowerCase() ?? null,
        paidAt: new Date(),
      },
      tx,
    );
  });
};
