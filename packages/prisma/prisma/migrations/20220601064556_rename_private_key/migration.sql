/*
  Warnings:

  - You are about to drop the column `privateKey` on the `UserParentWallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserParentWallet" DROP COLUMN "privateKey",
ADD COLUMN     "encryptedPrivateKey" TEXT;
