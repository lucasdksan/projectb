/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `store` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "store" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "store_slug_key" ON "store"("slug");
