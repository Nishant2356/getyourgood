-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "listingId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "deliveryTime" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "acceptedById" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'accepted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_listingId_idx" ON "Order"("listingId");

-- CreateIndex
CREATE INDEX "Order_acceptedById_idx" ON "Order"("acceptedById");
