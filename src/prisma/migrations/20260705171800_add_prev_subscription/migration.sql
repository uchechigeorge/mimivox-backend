/*
  Warnings:

  - A unique constraint covering the columns `[previousSubscriptionId]` on the table `Subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "isDowngrade" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "previousSubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Subscriptions_previousSubscriptionId_key" ON "Subscriptions"("previousSubscriptionId");

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_previousSubscriptionId_fkey" FOREIGN KEY ("previousSubscriptionId") REFERENCES "Subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
