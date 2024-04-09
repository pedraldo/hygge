/*
  Warnings:

  - You are about to drop the column `user_id` on the `Media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[creator_id]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creator_id` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_user_id_fkey";

-- DropIndex
DROP INDEX "Media_user_id_key";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "user_id",
ADD COLUMN     "creator_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Media_creator_id_key" ON "Media"("creator_id");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
