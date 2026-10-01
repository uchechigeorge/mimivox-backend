-- AlterEnum
ALTER TYPE "ImageServiceType" ADD VALUE 'Runway';

-- AlterEnum
ALTER TYPE "TaskServiceOption" ADD VALUE 'Runway';

-- AlterEnum
ALTER TYPE "TaskType" ADD VALUE 'Image';

-- AlterEnum
ALTER TYPE "VideoServiceType" ADD VALUE 'Runway';

-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "taskId" UUID;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
