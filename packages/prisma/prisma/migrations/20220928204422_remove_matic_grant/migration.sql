/*
  Warnings:

  - You are about to drop the column `maticGrants` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the `MaticGrant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MaticGrant" DROP CONSTRAINT "MaticGrant_userId_fkey";

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "maticGrants";

-- DropTable
DROP TABLE "MaticGrant";
