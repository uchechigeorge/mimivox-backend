/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `Subscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentToken]` on the table `Subscriptions` will be added. If there are existing duplicate values, this will fail.
  - The required column `paymentToken` was added to the `Subscriptions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "SubscriptionPayments" ADD COLUMN     "currency" VARCHAR(1024);

-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "paymentToken" VARCHAR(1024) NOT NULL,
ADD COLUMN     "paymentVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "isActive" SET DEFAULT false;

-- CreateTable
CREATE TABLE "PaystackCustomers" (
    "id" UUID NOT NULL,
    "userId" VARCHAR(1024),
    "email" VARCHAR(1024) NOT NULL,
    "reference" VARCHAR(1024) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PaystackCustomers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaystackPlans" (
    "id" UUID NOT NULL,
    "pricingId" VARCHAR(1024),
    "reference" VARCHAR(1024) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PaystackPlans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaystackSubscriptions" (
    "id" UUID NOT NULL,
    "subscriptionId" VARCHAR(1024),
    "reference" VARCHAR(1024) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PaystackSubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_reference_key" ON "Subscriptions"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_paymentToken_key" ON "Subscriptions"("paymentToken");

-- AddForeignKey
ALTER TABLE "PaystackCustomers" ADD CONSTRAINT "PaystackCustomers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaystackPlans" ADD CONSTRAINT "PaystackPlans_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaystackSubscriptions" ADD CONSTRAINT "PaystackSubscriptions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
