-- AlterEnum
ALTER TYPE "AudioServiceType" ADD VALUE 'Noiz';

-- AlterTable
ALTER TABLE "PlanSettings" ADD COLUMN     "noOfCloneVoices" INTEGER DEFAULT 0,
ADD COLUMN     "noOfCredits" INTEGER DEFAULT 0,
ADD COLUMN     "noOfImages" INTEGER DEFAULT 0,
ADD COLUMN     "noOfMusic" INTEGER DEFAULT 0,
ADD COLUMN     "noOfPremiumVoices" INTEGER DEFAULT 0,
ADD COLUMN     "noOfVideos" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "noOfCloneVoicesAllocated" INTEGER DEFAULT 0,
ADD COLUMN     "noOfCloneVoicesLeft" INTEGER DEFAULT 0,
ADD COLUMN     "noOfCloneVoicesUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfCreditsAllocated" INTEGER DEFAULT 0,
ADD COLUMN     "noOfCreditsLeft" INTEGER DEFAULT 0,
ADD COLUMN     "noOfCreditsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfImagesAllocated" INTEGER DEFAULT 0,
ADD COLUMN     "noOfImagesLeft" INTEGER DEFAULT 0,
ADD COLUMN     "noOfImagesUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfMusicAllocated" INTEGER DEFAULT 0,
ADD COLUMN     "noOfMusicLeft" INTEGER DEFAULT 0,
ADD COLUMN     "noOfMusicUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfPremiumVoicesAllocated" INTEGER DEFAULT 0,
ADD COLUMN     "noOfPremiumVoicesLeft" INTEGER DEFAULT 0,
ADD COLUMN     "noOfPremiumVoicesUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noOfVideosAllocated" INTEGER DEFAULT 0,
ADD COLUMN     "noOfVideosLeft" INTEGER DEFAULT 0,
ADD COLUMN     "noOfVideosUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCharactersUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCloneVoicesUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalCreditsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalImagesUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalMusicUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPremiumVoicesUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalVideosUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalVoicesUsed" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Voices" ADD COLUMN     "audioServiceRequestLog" JSONB;

-- CreateTable
CREATE TABLE "Admins" (
    "id" VARCHAR(1024) NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "firstName" VARCHAR(1024) NOT NULL,
    "lastName" VARCHAR(1024) NOT NULL,
    "fullName" VARCHAR(1024) NOT NULL DEFAULT '',
    "password" VARCHAR(1024) NOT NULL,
    "dpUrl" VARCHAR(1024),
    "defaultBg" VARCHAR(1024),
    "phoneNumber" VARCHAR(1024),
    "blocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admins_email_key" ON "Admins"("email");
