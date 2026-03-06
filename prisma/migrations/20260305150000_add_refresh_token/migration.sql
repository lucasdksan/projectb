-- AlterTable
ALTER TABLE "users" ADD COLUMN "refreshTokenHash" TEXT;
ALTER TABLE "users" ADD COLUMN "refreshTokenExpiresAt" DATETIME;
