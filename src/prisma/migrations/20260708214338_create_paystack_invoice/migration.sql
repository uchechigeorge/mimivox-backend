-- AlterTable
ALTER TABLE "SubscriptionPayments" ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PaystackInvoices" (
    "id" UUID NOT NULL,
    "subscriptionPaymentId" UUID,
    "reference" VARCHAR(1024) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PaystackInvoices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaystackInvoices" ADD CONSTRAINT "PaystackInvoices_subscriptionPaymentId_fkey" FOREIGN KEY ("subscriptionPaymentId") REFERENCES "SubscriptionPayments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
