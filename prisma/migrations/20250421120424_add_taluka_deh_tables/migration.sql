/*
  Warnings:

  - You are about to drop the column `code` on the `Deh` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `Taluka` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,talukaId]` on the table `Deh` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Taluka` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Deh` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Deh` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Taluka` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Taluka` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Deh" DROP CONSTRAINT "Deh_talukaId_fkey";

-- AlterTable
ALTER TABLE "Deh" DROP COLUMN "code",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Taluka" DROP COLUMN "code",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Deh_name_talukaId_key" ON "Deh"("name", "talukaId");

-- CreateIndex
CREATE UNIQUE INDEX "Taluka_name_key" ON "Taluka"("name");

-- AddForeignKey
ALTER TABLE "Deh" ADD CONSTRAINT "Deh_talukaId_fkey" FOREIGN KEY ("talukaId") REFERENCES "Taluka"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
