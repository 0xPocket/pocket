/*
  Warnings:

  - You are about to drop the column `userWalletId` on the `UserParent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userParentId]` on the table `UserParentWallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userParentId` to the `UserParentWallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserParent" DROP CONSTRAINT "UserParent_userWalletId_fkey";

-- AlterTable
ALTER TABLE "UserParent" DROP COLUMN "userWalletId";

-- AlterTable
ALTER TABLE "UserParentWallet" ADD COLUMN     "userParentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserParentWallet_userParentId_key" ON "UserParentWallet"("userParentId");

-- AddForeignKey
ALTER TABLE "UserParentWallet" ADD CONSTRAINT "UserParentWallet_userParentId_fkey" FOREIGN KEY ("userParentId") REFERENCES "UserParent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
