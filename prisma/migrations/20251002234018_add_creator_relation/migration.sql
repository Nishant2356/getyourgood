/*
  Warnings:

  - You are about to drop the column `creator` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "creator",
ADD COLUMN     "creatorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
