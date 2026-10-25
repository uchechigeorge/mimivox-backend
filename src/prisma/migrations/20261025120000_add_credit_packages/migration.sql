-- CreateEnum
CREATE TYPE "CreditPackageType" AS ENUM ('TopUp', 'BuyCredit');

-- CreateEnum
CREATE TYPE "CreditPurchaseStatus" AS ENUM ('Pending', 'Paid', 'Failed');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "noOfTopUpCreditsLeft" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CreditPackages" (
    "id" VARCHAR(1024) NOT NULL,
    "slug" VARCHAR(1024) NOT NULL,
    "name" VARCHAR(1024) NOT NULL,
    "description" VARCHAR(1024),
    "type" "CreditPackageType" NOT NULL,
    "price" DECIMAL(18,2) NOT NULL,
    "noOfCredits" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CreditPackages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditPurchases" (
    "id" UUID NOT NULL,
    "reference" VARCHAR(1024) NOT NULL,
    "paymentToken" VARCHAR(1024) NOT NULL,
    "userId" VARCHAR(1024) NOT NULL,
    "userName" VARCHAR(1024) NOT NULL,
    "packageId" VARCHAR(1024) NOT NULL,
    "packageName" VARCHAR(1024) NOT NULL,
    "type" "CreditPackageType" NOT NULL,
    "noOfCredits" INTEGER NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "amountPaid" DECIMAL(18,2),
    "currency" VARCHAR(1024),
    "status" "CreditPurchaseStatus" NOT NULL DEFAULT 'Pending',
    "paymentVerified" BOOLEAN NOT NULL DEFAULT false,
    "paymentGateway" "PaymentGatewayOption" NOT NULL DEFAULT 'None',
    "subscriptionId" VARCHAR(1024),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CreditPurchases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditPackages_slug_key" ON "CreditPackages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CreditPurchases_reference_key" ON "CreditPurchases"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "CreditPurchases_paymentToken_key" ON "CreditPurchases"("paymentToken");

-- AddForeignKey
ALTER TABLE "CreditPurchases" ADD CONSTRAINT "CreditPurchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditPurchases" ADD CONSTRAINT "CreditPurchases_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "CreditPackages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

