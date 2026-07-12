/*
  Warnings:

  - You are about to alter the column `amount` on the `PaystackPlans` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,2)` to `Integer`.
  - Added the required column `token` to the `PaystackSubscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaystackPlans" ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "PaystackSubscriptions" ADD COLUMN     "token" VARCHAR(1024) NOT NULL;
