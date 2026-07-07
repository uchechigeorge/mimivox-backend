/*
  Warnings:

  - You are about to drop the column `noOfWords` on the `PricingSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlanSettings" ADD COLUMN     "noOfWordsAllowed" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "PricingSettings" DROP COLUMN "noOfWords",
ADD COLUMN     "noOfWordsAllowed" INTEGER DEFAULT 0;
