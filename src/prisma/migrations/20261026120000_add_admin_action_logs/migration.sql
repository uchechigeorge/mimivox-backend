-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('SubscriptionActivated', 'SubscriptionChanged', 'SubscriptionCancelled', 'SubscriptionExtended', 'CreditTopUp', 'CreditAdded');

-- CreateTable
CREATE TABLE "AdminActionLogs" (
    "id" UUID NOT NULL,
    "adminId" VARCHAR(1024),
    "adminName" VARCHAR(1024),
    "userId" VARCHAR(1024) NOT NULL,
    "userName" VARCHAR(1024),
    "action" "AdminActionType" NOT NULL,
    "description" VARCHAR(1024) NOT NULL,
    "noOfCredits" INTEGER,
    "amount" DECIMAL(18,2),
    "note" VARCHAR(1024),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActionLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminActionLogs_userId_createdAt_idx" ON "AdminActionLogs"("userId", "createdAt");
