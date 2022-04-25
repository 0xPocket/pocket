/*
  Warnings:

  - You are about to drop the column `expires_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropIndex
DROP INDEX "Account_provider_providerAccountId_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "expires_at",
DROP COLUMN "token_type",
ADD COLUMN     "expiresAt" INTEGER,
ADD COLUMN     "tokenType" "TokenType";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "UserParent" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "userWalletId" TEXT NOT NULL,

    CONSTRAINT "UserParent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChild" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "web3AccountId" TEXT,
    "userParentId" TEXT NOT NULL,

    CONSTRAINT "UserChild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserParentWallet" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT,

    CONSTRAINT "UserParentWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Web3Account" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,

    CONSTRAINT "Web3Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserParent_email_key" ON "UserParent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserChild_username_key" ON "UserChild"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserChild_email_key" ON "UserChild"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Web3Account_address_key" ON "Web3Account"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- AddForeignKey
ALTER TABLE "UserParent" ADD CONSTRAINT "UserParent_userWalletId_fkey" FOREIGN KEY ("userWalletId") REFERENCES "UserParentWallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChild" ADD CONSTRAINT "UserChild_userParentId_fkey" FOREIGN KEY ("userParentId") REFERENCES "UserParent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChild" ADD CONSTRAINT "UserChild_web3AccountId_fkey" FOREIGN KEY ("web3AccountId") REFERENCES "Web3Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserParent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
