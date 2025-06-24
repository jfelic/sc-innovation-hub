/*
  Warnings:

  - You are about to drop the column `category` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `organizerId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `events` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizerId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "category",
DROP COLUMN "isFeatured",
DROP COLUMN "isPublic",
DROP COLUMN "organizerId",
DROP COLUMN "tags",
ADD COLUMN     "industry" TEXT[],
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "organizerName" TEXT,
ADD COLUMN     "organizerWebsite" TEXT,
ALTER COLUMN "sourceType" SET DEFAULT 'extracted';
