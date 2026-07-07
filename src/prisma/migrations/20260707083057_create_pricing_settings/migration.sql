-- AlterTable
ALTER TABLE "PlanSettings" ADD COLUMN     "maxVideoDurationInSeconds" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "maxVideoDurationInSeconds" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "PricingSettings" (
    "id" VARCHAR(1024) NOT NULL,
    "pricingId" TEXT NOT NULL,
    "pricingName" VARCHAR(1024) NOT NULL,
    "noOfCredits" INTEGER DEFAULT 0,
    "noOfCharacters" INTEGER DEFAULT 0,
    "noOfWords" INTEGER DEFAULT 0,
    "noOfVoices" INTEGER DEFAULT 0,
    "noOfPremiumVoices" INTEGER DEFAULT 0,
    "noOfCloneVoices" INTEGER DEFAULT 0,
    "noOfMusic" INTEGER DEFAULT 0,
    "noOfImages" INTEGER DEFAULT 0,
    "noOfVideos" INTEGER DEFAULT 0,
    "maxVideoDurationInSeconds" INTEGER DEFAULT 0,
    "hasCommunitySupport" BOOLEAN NOT NULL DEFAULT true,
    "hasEmailSupport" BOOLEAN NOT NULL DEFAULT false,
    "socialMediaGuidelines" INTEGER NOT NULL DEFAULT 1,
    "hasDedicatedCustomerSupport" BOOLEAN NOT NULL DEFAULT false,
    "hasApiAccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PricingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PricingSettings_pricingId_key" ON "PricingSettings"("pricingId");

-- AddForeignKey
ALTER TABLE "PricingSettings" ADD CONSTRAINT "PricingSettings_pricingId_fkey" FOREIGN KEY ("pricingId") REFERENCES "Pricings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
