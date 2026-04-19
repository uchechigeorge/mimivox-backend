-- CreateEnum
CREATE TYPE "ImageServiceType" AS ENUM ('None', 'Xai');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('None', 'Music', 'Video');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Pending', 'Started', 'Completed');

-- CreateEnum
CREATE TYPE "TaskServiceOption" AS ENUM ('None', 'Suno', 'Xai');

-- CreateEnum
CREATE TYPE "MusicServiceType" AS ENUM ('None', 'Suno');

-- CreateEnum
CREATE TYPE "VideoServiceType" AS ENUM ('None', 'Xai');

-- CreateTable
CREATE TABLE "Images" (
    "id" UUID NOT NULL,
    "userId" VARCHAR(1024),
    "userName" VARCHAR(1024),
    "title" VARCHAR(1024) NOT NULL,
    "prompt" VARCHAR(1024) NOT NULL,
    "url" VARCHAR(1024),
    "altUrl" VARCHAR(1024),
    "imageServiceType" "ImageServiceType" NOT NULL DEFAULT 'None',
    "imageServiceRequestLog" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tasks" (
    "id" UUID NOT NULL,
    "referenceId" VARCHAR(1024) NOT NULL,
    "userId" VARCHAR(1024),
    "userName" VARCHAR(1024),
    "type" "TaskType" NOT NULL DEFAULT 'None',
    "status" "TaskStatus" NOT NULL DEFAULT 'Pending',
    "progress" INTEGER,
    "resultUrl" TEXT,
    "errorMessage" TEXT,
    "serviceOption" "TaskServiceOption" NOT NULL DEFAULT 'None',
    "serviceRequestLog" JSONB,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 5,
    "lockedAt" TIMESTAMP(3),
    "lockedBy" TEXT,
    "nextRunAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Musics" (
    "id" UUID NOT NULL,
    "userId" VARCHAR(1024),
    "userName" VARCHAR(1024),
    "title" VARCHAR(1024) NOT NULL,
    "prompt" VARCHAR(1024) NOT NULL,
    "audioUrl" VARCHAR(1024),
    "audioAltUrl" VARCHAR(1024),
    "streamAudioUrl" VARCHAR(1024),
    "streamAudioAltUrl" VARCHAR(1024),
    "imageUrl" VARCHAR(1024),
    "imageAltUrl" VARCHAR(1024),
    "durationInSeconds" INTEGER,
    "musicServiceReferenceId" VARCHAR(1024),
    "musicServiceType" "MusicServiceType" NOT NULL DEFAULT 'None',
    "musicServiceRequestLog" JSONB,
    "taskId" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Musics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Videos" (
    "id" UUID NOT NULL,
    "userId" VARCHAR(1024),
    "userName" VARCHAR(1024),
    "title" VARCHAR(1024) NOT NULL,
    "prompt" VARCHAR(1024) NOT NULL,
    "url" VARCHAR(1024),
    "altUrl" VARCHAR(1024),
    "thumbnailUrl" VARCHAR(1024),
    "durationInSeconds" INTEGER,
    "videoServiceReferenceId" VARCHAR(1024),
    "videoServiceType" "VideoServiceType" NOT NULL DEFAULT 'None',
    "videoServiceRequestLog" JSONB,
    "taskId" UUID,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Videos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Musics" ADD CONSTRAINT "Musics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Musics" ADD CONSTRAINT "Musics_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Videos" ADD CONSTRAINT "Videos_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
