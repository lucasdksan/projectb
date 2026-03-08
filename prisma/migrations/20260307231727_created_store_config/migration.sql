-- CreateTable
CREATE TABLE "configStore" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "configStore_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "configStore_storeId_key" ON "configStore"("storeId");
