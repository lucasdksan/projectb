-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_instagramConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "userInstagramId" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "instagramConfig_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_instagramConfig" ("createdAt", "id", "storeId", "token", "updatedAt", "userInstagramId") SELECT "createdAt", "id", "storeId", "token", "updatedAt", "userInstagramId" FROM "instagramConfig";
DROP TABLE "instagramConfig";
ALTER TABLE "new_instagramConfig" RENAME TO "instagramConfig";
CREATE UNIQUE INDEX "instagramConfig_storeId_key" ON "instagramConfig"("storeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
