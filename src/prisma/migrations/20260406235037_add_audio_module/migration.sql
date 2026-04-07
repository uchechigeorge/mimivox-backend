/*
  Warnings:

  - The primary key for the `Plans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Plans` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `name` on the `Plans` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `description` on the `Plans` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - The primary key for the `Pricings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `intervalTypeId` on the `Pricings` table. All the data in the column will be lost.
  - You are about to drop the column `intervalTypeName` on the `Pricings` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Pricings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `planId` on the `Pricings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `planName` on the `Pricings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `name` on the `Pricings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `description` on the `Pricings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `interval` on the `Pricings` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - The primary key for the `Subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `isValid` on the `Subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `Subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `statusName` on the `Subscriptions` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `userId` on the `Subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `pricingId` on the `Subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `pricingName` on the `Subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `planId` on the `Subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `planName` on the `Subscriptions` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hasValidSubscription` on the `Users` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `firstName` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `lastName` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `fullName` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `password` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `dpUrl` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `defaultBg` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - You are about to alter the column `phoneNumber` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1024)`.
  - A unique constraint covering the columns `[slug]` on the table `Plans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Pricings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Pricings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IntervalType" AS ENUM ('None', 'Year', 'Month', 'Week', 'Day');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('Pending', 'WillRenew', 'Completed', 'Cancelled', 'PastDue', 'Trialing');

-- CreateEnum
CREATE TYPE "PaymentGatewayOption" AS ENUM ('None', 'Manual', 'Paystack');

-- CreateEnum
CREATE TYPE "VoiceType" AS ENUM ('Default', 'Cloned');

-- CreateEnum
CREATE TYPE "AudioServiceType" AS ENUM ('None', 'Google', 'ElevenLabs');

-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_planId_fkey";

-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_pricingId_fkey";

-- DropForeignKey
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_userId_fkey";

-- AlterTable
ALTER TABLE "Plans" DROP CONSTRAINT "Plans_pkey",
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" VARCHAR(1024) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "sequence" SET DEFAULT 0,
ADD CONSTRAINT "Plans_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Pricings" DROP CONSTRAINT "Pricings_pkey",
DROP COLUMN "intervalTypeId",
DROP COLUMN "intervalTypeName",
ADD COLUMN     "intervalType" "IntervalType" NOT NULL DEFAULT 'None',
ADD COLUMN     "slug" VARCHAR(1024) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "planId" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "planName" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "interval" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "sequence" SET DEFAULT 0,
ADD CONSTRAINT "Pricings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Subscriptions" DROP CONSTRAINT "Subscriptions_pkey",
DROP COLUMN "isValid",
DROP COLUMN "statusId",
DROP COLUMN "statusName",
ADD COLUMN     "initialAmount" DECIMAL(18,2),
ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ADD COLUMN     "nextBillingDate" TIMESTAMP(3),
ADD COLUMN     "paymentGateway" "PaymentGatewayOption" NOT NULL DEFAULT 'None',
ADD COLUMN     "reference" VARCHAR(1024) NOT NULL,
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "userName" VARCHAR(1024) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "userId" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "pricingId" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "pricingName" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "planId" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "planName" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "endDate" DROP NOT NULL,
ADD CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "hasValidSubscription",
ADD COLUMN     "hasActiveSubscription" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "noOfCharactersAllocated" INTEGER DEFAULT 0,
ADD COLUMN     "noOfCharactersLeft" INTEGER DEFAULT 0,
ADD COLUMN     "noOfCharactersUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfVoicesAllocated" INTEGER DEFAULT 0,
ADD COLUMN     "noOfVoicesLeft" INTEGER DEFAULT 0,
ADD COLUMN     "noOfVoicesUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfWordsAllowed" INTEGER DEFAULT 0,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "fullName" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "dpUrl" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "defaultBg" SET DATA TYPE VARCHAR(1024),
ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(1024),
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "PlanSettings" (
    "id" VARCHAR(1024) NOT NULL,
    "planId" TEXT NOT NULL,
    "planName" VARCHAR(1024) NOT NULL,
    "noOfCharacters" INTEGER DEFAULT 0,
    "noOfWords" INTEGER DEFAULT 0,
    "noOfVoices" INTEGER DEFAULT 0,
    "hasCommunitySupport" BOOLEAN NOT NULL DEFAULT true,
    "hasEmailSupport" BOOLEAN NOT NULL DEFAULT false,
    "socialMediaGuidelines" INTEGER NOT NULL DEFAULT 1,
    "hasDedicatedCustomerSupport" BOOLEAN NOT NULL DEFAULT false,
    "hasApiAccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PlanSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voices" (
    "id" VARCHAR(1024) NOT NULL,
    "name" VARCHAR(1024) NOT NULL,
    "description" VARCHAR(1024),
    "type" "VoiceType" NOT NULL DEFAULT 'Cloned',
    "userId" VARCHAR(1024),
    "userName" VARCHAR(1024),
    "serviceReferenceId" VARCHAR(1024),
    "audioServiceType" "AudioServiceType" NOT NULL,
    "sampleAudioUrl" VARCHAR(1024),
    "exampleAudioUrl" VARCHAR(1024),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Voices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audios" (
    "id" VARCHAR(1024) NOT NULL,
    "userId" VARCHAR(1024) NOT NULL,
    "userName" VARCHAR(1024) NOT NULL,
    "content" TEXT NOT NULL,
    "language" VARCHAR(1024) NOT NULL,
    "voiceId" VARCHAR(1024) NOT NULL,
    "voiceName" VARCHAR(1024) NOT NULL,
    "audioUrl" VARCHAR(1024),
    "audioServiceType" "AudioServiceType" NOT NULL DEFAULT 'None',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Audios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanSettings_planId_key" ON "PlanSettings"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "Plans_slug_key" ON "Plans"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pricings_slug_key" ON "Pricings"("slug");

-- AddForeignKey
ALTER TABLE "PlanSettings" ADD CONSTRAINT "PlanSettings_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricings" ADD CONSTRAINT "Pricings_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voices" ADD CONSTRAINT "Voices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audios" ADD CONSTRAINT "Audios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audios" ADD CONSTRAINT "Audios_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "Voices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
