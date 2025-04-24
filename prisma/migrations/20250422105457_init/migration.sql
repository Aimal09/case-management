-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "barrageBranchReportUploaded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "evacueePropertyReportUploaded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mukhtiarkarACReportUploaded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "newspaperPublicationUploaded" BOOLEAN NOT NULL DEFAULT false;
