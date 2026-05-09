-- CreateEnum
CREATE TYPE "AuthTokenType" AS ENUM ('None', 'VerifyEmail', 'ForgotPassword');

-- CreateTable
CREATE TABLE "UserTokens" (
    "id" UUID NOT NULL,
    "userId" VARCHAR(1024),
    "type" "AuthTokenType" NOT NULL DEFAULT 'None',
    "token" VARCHAR(1024) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminTokens" (
    "id" UUID NOT NULL,
    "adminId" VARCHAR(1024),
    "type" "AuthTokenType" NOT NULL DEFAULT 'None',
    "token" VARCHAR(1024) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AdminTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTokens_token_key" ON "UserTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AdminTokens_token_key" ON "AdminTokens"("token");

-- AddForeignKey
ALTER TABLE "UserTokens" ADD CONSTRAINT "UserTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminTokens" ADD CONSTRAINT "AdminTokens_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
