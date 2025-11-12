-- CreateTable
CREATE TABLE "Listing" (
    "id" SERIAL NOT NULL,
    "items" JSONB NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "creator" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
