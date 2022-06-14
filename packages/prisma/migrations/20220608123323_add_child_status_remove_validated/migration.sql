/*
  Warnings:

  - You are about to drop the column `validated` on the `UserChild` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ChildStatus" AS ENUM ('INVITED', 'LINKED', 'PENDING', 'ACTIVE', 'LOCKED');

-- AlterTable
ALTER TABLE "UserChild" DROP COLUMN "validated",
ADD COLUMN     "status" "ChildStatus" NOT NULL DEFAULT E'INVITED';
