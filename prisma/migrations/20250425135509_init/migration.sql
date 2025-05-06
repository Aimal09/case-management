/*
  Warnings:

  - You are about to drop the column `forwardedByName` on the `Case` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Case" DROP COLUMN "forwardedByName",
ADD COLUMN     "forwardedById" TEXT;
