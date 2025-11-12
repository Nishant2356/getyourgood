/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Order";

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "listingId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "acceptedById" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'accepted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_listingId_idx" ON "orders"("listingId");

-- CreateIndex
CREATE INDEX "orders_acceptedById_idx" ON "orders"("acceptedById");
