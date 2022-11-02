/*
  Warnings:

  - You are about to drop the column `initialCeiling` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `initialPeriodicity` on the `Child` table. All the data in the column will be lost.
  - You are about to drop the column `initialCeiling` on the `PendingChild` table. All the data in the column will be lost.
  - You are about to drop the column `initialPeriodicity` on the `PendingChild` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Child" DROP CONSTRAINT "Child_parentUserId_fkey";

-- AlterTable
ALTER TABLE "Child" DROP COLUMN "initialCeiling",
DROP COLUMN "initialPeriodicity",
ALTER COLUMN "parentUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PendingChild" DROP COLUMN "initialCeiling",
DROP COLUMN "initialPeriodicity";

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "Parent"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
