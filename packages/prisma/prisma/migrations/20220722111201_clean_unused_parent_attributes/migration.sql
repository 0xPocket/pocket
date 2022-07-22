/*
  Warnings:

  - You are about to drop the column `userId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `UserChild` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `UserParent` table. All the data in the column will be lost.
  - You are about to drop the `UserParentWallet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `UserParent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserParentWallet" DROP CONSTRAINT "UserParentWallet_userParentId_fkey";

-- DropIndex
DROP INDEX "Account_userId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "UserChild" DROP COLUMN "lastName";

-- AlterTable
ALTER TABLE "UserParent" DROP COLUMN "emailVerified",
ADD COLUMN     "address" TEXT NOT NULL,
ALTER COLUMN "firstName" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL;

-- DropTable
DROP TABLE "UserParentWallet";

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromAddress" TEXT NOT NULL,
    "toAddress" TEXT,
    "blockNum" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "asset" TEXT,
    "erc721TokenId" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ActivityToUserChild" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToUserChild_AB_unique" ON "_ActivityToUserChild"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToUserChild_B_index" ON "_ActivityToUserChild"("B");

-- AddForeignKey
ALTER TABLE "_ActivityToUserChild" ADD CONSTRAINT "_ActivityToUserChild_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToUserChild" ADD CONSTRAINT "_ActivityToUserChild_B_fkey" FOREIGN KEY ("B") REFERENCES "UserChild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
