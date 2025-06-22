/*
  Warnings:

  - You are about to drop the column `isVerified` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "isVerified",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "zipCode",
ALTER COLUMN "city" SET DEFAULT 'Charleston';
