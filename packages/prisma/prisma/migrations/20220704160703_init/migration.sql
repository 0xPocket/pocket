-- CreateEnum
CREATE TYPE "ChildStatus" AS ENUM ('INVITED', 'LINKED', 'PENDING', 'ACTIVE', 'LOCKED');

-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('oauth', 'credentials');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('Bearer');

-- CreateTable
CREATE TABLE "UserParent" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),

    CONSTRAINT "UserParent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChild" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "status" "ChildStatus" NOT NULL DEFAULT 'INVITED',
    "userParentId" TEXT NOT NULL,

    CONSTRAINT "UserChild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserParentWallet" (
    "id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "encryptedPrivateKey" TEXT,
    "userParentId" TEXT NOT NULL,

    CONSTRAINT "UserParentWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Web3Account" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Web3Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "type" "AuthType" NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "password" TEXT,
    "expiresAt" INTEGER,
    "tokenType" "TokenType",
    "scope" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sid" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "cryptoKnowledge" TEXT,
    "childKnowledge" TEXT,
    "childPlayToEarn" TEXT,
    "gavePocketMoney" TEXT,
    "contact" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserParent_email_key" ON "UserParent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserChild_username_key" ON "UserChild"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserChild_email_key" ON "UserChild"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserParentWallet_userParentId_key" ON "UserParentWallet"("userParentId");

-- CreateIndex
CREATE UNIQUE INDEX "Web3Account_address_key" ON "Web3Account"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Web3Account_userId_key" ON "Web3Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sid_key" ON "Session"("sid");

-- CreateIndex
CREATE UNIQUE INDEX "Survey_email_key" ON "Survey"("email");

-- AddForeignKey
ALTER TABLE "UserChild" ADD CONSTRAINT "UserChild_userParentId_fkey" FOREIGN KEY ("userParentId") REFERENCES "UserParent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserParentWallet" ADD CONSTRAINT "UserParentWallet_userParentId_fkey" FOREIGN KEY ("userParentId") REFERENCES "UserParent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Web3Account" ADD CONSTRAINT "Web3Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserChild"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserParent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
