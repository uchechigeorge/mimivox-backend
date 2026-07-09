-- CreateEnum
CREATE TYPE "SubscriptionPaymentStatus" AS ENUM ('Pending', 'Paid', 'Failed');

-- AlterTable
ALTER TABLE "SubscriptionPayments" ADD COLUMN     "status" "SubscriptionPaymentStatus" NOT NULL DEFAULT 'Pending';
