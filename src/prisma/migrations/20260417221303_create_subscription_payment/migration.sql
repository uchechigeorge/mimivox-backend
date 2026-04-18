-- CreateTable
CREATE TABLE "SubscriptionPayments" (
    "id" UUID NOT NULL,
    "subscriptionId" VARCHAR(1024),
    "subscriptionReference" VARCHAR(1024) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "isInitialPayment" BOOLEAN NOT NULL DEFAULT false,
    "isPaymentVerified" BOOLEAN NOT NULL DEFAULT false,
    "paymentGateway" "PaymentGatewayOption" NOT NULL DEFAULT 'None',
    "paidAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SubscriptionPayments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubscriptionPayments" ADD CONSTRAINT "SubscriptionPayments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
