-- AlterEnum
ALTER TYPE "AuthType" ADD VALUE 'credentials';

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "password" TEXT,
ALTER COLUMN "providerAccountId" DROP NOT NULL;
