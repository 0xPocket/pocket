/*
  Warnings:

  - You are about to drop the `UserChild` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserParent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Web3Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ActivityToUserChild` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Parent', 'Child');

-- CreateEnum
CREATE TYPE "RampStatus" AS ENUM ('CREATED', 'RELEASED', 'RETURNED', 'ERROR');

-- DropForeignKey
ALTER TABLE "UserChild" DROP CONSTRAINT "UserChild_userParentId_fkey";

-- DropForeignKey
ALTER TABLE "Web3Account" DROP CONSTRAINT "Web3Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToUserChild" DROP CONSTRAINT "_ActivityToUserChild_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityToUserChild" DROP CONSTRAINT "_ActivityToUserChild_B_fkey";

-- DropTable
DROP TABLE "UserChild";

-- DropTable
DROP TABLE "UserParent";

-- DropTable
DROP TABLE "Web3Account";

-- DropTable
DROP TABLE "_ActivityToUserChild";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "address" TEXT NOT NULL,
    "newUser" BOOLEAN NOT NULL DEFAULT true,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "type" "UserType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "userId" TEXT NOT NULL,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Child" (
    "userId" TEXT NOT NULL,
    "status" "ChildStatus" NOT NULL DEFAULT 'INVITED',
    "parentUserId" TEXT NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Ramp" (
    "id" SERIAL NOT NULL,
    "rampId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cryptoAmount" TEXT NOT NULL,
    "cryptoAsset" TEXT NOT NULL,
    "fiatValue" DOUBLE PRECISION NOT NULL,
    "fiatCurrency" TEXT NOT NULL,
    "appliedFee" DOUBLE PRECISION NOT NULL,
    "status" "RampStatus" NOT NULL,
    "userParentId" TEXT NOT NULL,

    CONSTRAINT "Ramp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "_ActivityToChild" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_userId_key" ON "Parent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Child_userId_key" ON "Child"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ramp_rampId_key" ON "Ramp"("rampId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToChild_AB_unique" ON "_ActivityToChild"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToChild_B_index" ON "_ActivityToChild"("B");

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "Parent"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ramp" ADD CONSTRAINT "Ramp_userParentId_fkey" FOREIGN KEY ("userParentId") REFERENCES "Parent"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToChild" ADD CONSTRAINT "_ActivityToChild_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToChild" ADD CONSTRAINT "_ActivityToChild_B_fkey" FOREIGN KEY ("B") REFERENCES "Child"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
