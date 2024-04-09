/*
  Warnings:

  - You are about to drop the `_EventToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `avatar` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT NOT NULL,
ADD COLUMN     "target_event_id" TEXT;

-- DropTable
DROP TABLE "_EventToUser";

-- CreateTable
CREATE TABLE "_users_events" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_users_events_AB_unique" ON "_users_events"("A", "B");

-- CreateIndex
CREATE INDEX "_users_events_B_index" ON "_users_events"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_target_event_id_fkey" FOREIGN KEY ("target_event_id") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_events" ADD CONSTRAINT "_users_events_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_events" ADD CONSTRAINT "_users_events_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
