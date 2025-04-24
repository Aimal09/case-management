-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "requiresBarrageBranchReport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresEvacueePropertyReport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresMukhtiarkarACReport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresNewspaperPublication" BOOLEAN NOT NULL DEFAULT false;
