/*
  Warnings:

  - Made the column `cover` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "cover" SET NOT NULL;

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "is_cover" BOOLEAN NOT NULL DEFAULT false;
