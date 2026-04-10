/*
  Warnings:

  - You are about to drop the column `language` on the `Audios` table. All the data in the column will be lost.
  - You are about to drop the column `exampleAudioUrl` on the `Voices` table. All the data in the column will be lost.
  - You are about to drop the column `sampleAudioUrl` on the `Voices` table. All the data in the column will be lost.
  - You are about to drop the column `serviceReferenceId` on the `Voices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[audioServiceType,audioServiceReferenceId]` on the table `Voices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Audios" DROP COLUMN "language",
ADD COLUMN     "audioServiceRequestLog" JSONB,
ADD COLUMN     "languageCode" VARCHAR(1024) NOT NULL DEFAULT 'en-US';

-- AlterTable
ALTER TABLE "Voices" DROP COLUMN "exampleAudioUrl",
DROP COLUMN "sampleAudioUrl",
DROP COLUMN "serviceReferenceId",
ADD COLUMN     "audioServiceReferenceId" VARCHAR(1024),
ADD COLUMN     "gender" VARCHAR(1024),
ADD COLUMN     "previewUrl" VARCHAR(1024),
ADD COLUMN     "sampleUrl" VARCHAR(1024),
ADD COLUMN     "sequence" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Voices_audioServiceType_audioServiceReferenceId_key" ON "Voices"("audioServiceType", "audioServiceReferenceId");
