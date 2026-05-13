-- AlterTable
ALTER TABLE "SubscriptionPayments" ADD COLUMN     "userId" VARCHAR(1024),
ADD COLUMN     "userName" VARCHAR(1024);

-- AddForeignKey
ALTER TABLE "SubscriptionPayments" ADD CONSTRAINT "SubscriptionPayments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
