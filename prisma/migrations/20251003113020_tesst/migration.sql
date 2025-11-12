/*
  Warnings:

  - You are about to drop the column `description` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "description",
ALTER COLUMN "deliveryTime" SET DATA TYPE TEXT;
