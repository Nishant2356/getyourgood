-- CreateTable
CREATE TABLE "public"."Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);
