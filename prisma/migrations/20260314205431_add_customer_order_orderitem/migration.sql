-- CreateTable
CREATE TABLE "customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cep" TEXT,
    "city" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "customer_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "storeId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "subtotal" REAL NOT NULL,
    "shipping" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    CONSTRAINT "orderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
