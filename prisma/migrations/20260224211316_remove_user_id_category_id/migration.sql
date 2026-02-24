/*
  Warnings:

  - You are about to drop the column `categoryId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `products` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "storeId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_products" ("createdAt", "description", "id", "isActive", "name", "price", "stock", "storeId", "updatedAt") SELECT "createdAt", "description", "id", "isActive", "name", "price", "stock", "storeId", "updatedAt" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
