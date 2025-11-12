/*
  Warnings:

  - Changed the type of `listingId` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "listingId",
ADD COLUMN     "listingId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "orders_listingId_idx" ON "orders"("listingId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
