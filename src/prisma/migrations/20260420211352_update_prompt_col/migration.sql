-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'Failed';

-- AlterTable
ALTER TABLE "Images" ALTER COLUMN "prompt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Musics" ALTER COLUMN "prompt" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Videos" ALTER COLUMN "prompt" SET DATA TYPE TEXT;
