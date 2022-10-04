/*
  Warnings:

  - You are about to drop the column `status` on the `Child` table. All the data in the column will be lost.
  - Made the column `initialCeiling` on table `Child` required. This step will fail if there are existing NULL values in that column.
  - Made the column `initialPeriodicity` on table `Child` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Child" DROP COLUMN "status",
ALTER COLUMN "initialCeiling" SET NOT NULL,
ALTER COLUMN "initialPeriodicity" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- DropEnum
DROP TYPE "ChildStatus";

-- CreateTable
CREATE TABLE "PendingChild" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "initialPeriodicity" TEXT NOT NULL,
    "initialCeiling" INTEGER NOT NULL,
    "parentUserId" TEXT NOT NULL,

    CONSTRAINT "PendingChild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingChild_email_key" ON "PendingChild"("email");

-- AddForeignKey
ALTER TABLE "PendingChild" ADD CONSTRAINT "PendingChild_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "Parent"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
