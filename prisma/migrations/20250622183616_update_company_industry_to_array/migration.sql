/*
  Warnings:

  - The `industry` column on the `companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `size` column on the `companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "industry",
ADD COLUMN     "industry" TEXT[],
DROP COLUMN "size",
ADD COLUMN     "size" INTEGER,
ALTER COLUMN "state" SET DEFAULT 'South Carolina';
