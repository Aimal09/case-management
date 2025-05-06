/*
  Warnings:

  - You are about to drop the column `forwardedById` on the `Case` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Case" DROP COLUMN "forwardedById",
ADD COLUMN     "forwardedByName" TEXT;
