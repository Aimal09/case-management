/*
  Warnings:

  - You are about to drop the column `requiresBarrageBranchReport` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `requiresEvacueePropertyReport` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `requiresMukhtiarkarACReport` on the `Case` table. All the data in the column will be lost.
  - You are about to drop the column `requiresNewspaperPublication` on the `Case` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Case" DROP COLUMN "requiresBarrageBranchReport",
DROP COLUMN "requiresEvacueePropertyReport",
DROP COLUMN "requiresMukhtiarkarACReport",
DROP COLUMN "requiresNewspaperPublication";
