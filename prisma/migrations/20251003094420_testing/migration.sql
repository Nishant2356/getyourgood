/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `creator` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Listing" DROP CONSTRAINT "Listing_creatorId_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "creatorId",
ADD COLUMN     "creator" TEXT NOT NULL;
