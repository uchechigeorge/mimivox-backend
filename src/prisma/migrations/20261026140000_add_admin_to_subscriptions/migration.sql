-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "adminId" VARCHAR(1024),
ADD COLUMN     "adminName" VARCHAR(1024);

-- AlterTable
ALTER TABLE "SubscriptionPayments" ADD COLUMN     "adminId" VARCHAR(1024),
ADD COLUMN     "adminName" VARCHAR(1024);
