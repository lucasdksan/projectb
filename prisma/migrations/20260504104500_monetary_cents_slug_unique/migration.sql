-- RedefineTables: Float monetário -> Int (centavos) + @@unique(storeId, slug) em products
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "subtotal" INTEGER NOT NULL,
    "shipping" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_order" ("createdAt", "customerId", "id", "shipping", "status", "storeId", "subtotal", "total", "updatedAt")
SELECT
    "createdAt",
    "customerId",
    "id",
    CAST(ROUND("shipping" * 100) AS INTEGER),
    "status",
    "storeId",
    CAST(ROUND("subtotal" * 100) AS INTEGER),
    CAST(ROUND("total" * 100) AS INTEGER),
    "updatedAt"
FROM "order";

DROP TABLE "order";
ALTER TABLE "new_order" RENAME TO "order";

CREATE TABLE "new_orderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    CONSTRAINT "orderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_orderItem" ("id", "orderId", "productId", "quantity", "unitPrice")
SELECT
    "id",
    "orderId",
    "productId",
    "quantity",
    CAST(ROUND("unitPrice" * 100) AS INTEGER)
FROM "orderItem";

DROP TABLE "orderItem";
ALTER TABLE "new_orderItem" RENAME TO "orderItem";

CREATE TABLE "new_products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "storeId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_products" ("createdAt", "description", "id", "isActive", "name", "price", "slug", "stock", "storeId", "updatedAt")
SELECT
    "createdAt",
    "description",
    "id",
    "isActive",
    "name",
    CAST(ROUND("price" * 100) AS INTEGER),
    "slug",
    "stock",
    "storeId",
    "updatedAt"
FROM "products";

DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";

CREATE UNIQUE INDEX "products_storeId_slug_key" ON "products"("storeId", "slug");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
