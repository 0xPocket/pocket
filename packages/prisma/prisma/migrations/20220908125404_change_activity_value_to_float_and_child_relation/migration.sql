/*
  Warnings:

  - You are about to drop the `_ActivityToChild` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `childUserId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `value` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_ActivityToChild" DROP CONSTRAINT "_ActivityToChild_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToChild" DROP CONSTRAINT "_ActivityToChild_B_fkey";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "childUserId" TEXT NOT NULL,
DROP COLUMN "value",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "_ActivityToChild";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_childUserId_fkey" FOREIGN KEY ("childUserId") REFERENCES "Child"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
