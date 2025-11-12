-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "address" JSONB,
ADD COLUMN     "deliveryTime" TIMESTAMP(3),
ADD COLUMN     "description" TEXT;
