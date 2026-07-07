-- AlterTable
ALTER TABLE "SubscriptionPayments" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "planId" VARCHAR(1024),
ADD COLUMN     "planName" VARCHAR(1024),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "SubscriptionPayments" ADD CONSTRAINT "SubscriptionPayments_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
