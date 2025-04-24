/*
  Warnings:

  - You are about to drop the `InvolvedOfficers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvolvedPersons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InvolvedOfficers" DROP CONSTRAINT "InvolvedOfficers_caseId_fkey";

-- DropForeignKey
ALTER TABLE "InvolvedPersons" DROP CONSTRAINT "InvolvedPersons_caseId_fkey";

-- DropTable
DROP TABLE "InvolvedOfficers";

-- DropTable
DROP TABLE "InvolvedPersons";

-- CreateTable
CREATE TABLE "CaseTypes" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT,

    CONSTRAINT "CaseTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Taluka" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT,

    CONSTRAINT "Taluka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deh" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "talukaId" TEXT NOT NULL,

    CONSTRAINT "Deh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "designation" TEXT,
    "contact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserCases_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deh" ADD CONSTRAINT "Deh_talukaId_fkey" FOREIGN KEY ("talukaId") REFERENCES "Taluka"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCases" ADD CONSTRAINT "UserCases_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
