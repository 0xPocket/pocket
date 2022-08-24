-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Magic', 'Ethereum');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'Ethereum';
