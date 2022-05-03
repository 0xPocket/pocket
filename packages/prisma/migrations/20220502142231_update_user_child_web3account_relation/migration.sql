/*
  Warnings:

  - You are about to drop the column `web3AccountId` on the `UserChild` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Web3Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Web3Account` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserChild" DROP CONSTRAINT "UserChild_web3AccountId_fkey";

-- AlterTable
ALTER TABLE "UserChild" DROP COLUMN "web3AccountId";

-- AlterTable
ALTER TABLE "Web3Account" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Web3Account_userId_key" ON "Web3Account"("userId");

-- AddForeignKey
ALTER TABLE "Web3Account" ADD CONSTRAINT "Web3Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserChild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
