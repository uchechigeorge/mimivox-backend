/*
  Warnings:

  - The primary key for the `Subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Subscriptions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "SubscriptionPayments" (
    "id" UUID NOT NULL,
    "subscriptionId" UUID,
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
