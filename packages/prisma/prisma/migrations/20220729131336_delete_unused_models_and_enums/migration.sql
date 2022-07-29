/*
  Warnings:

  - The values [LINKED,PENDING,LOCKED] on the enum `ChildStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChildStatus_new" AS ENUM ('INVITED', 'ACTIVE');
ALTER TABLE "Child" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Child" ALTER COLUMN "status" TYPE "ChildStatus_new" USING ("status"::text::"ChildStatus_new");
ALTER TYPE "ChildStatus" RENAME TO "ChildStatus_old";
ALTER TYPE "ChildStatus_new" RENAME TO "ChildStatus";
DROP TYPE "ChildStatus_old";
ALTER TABLE "Child" ALTER COLUMN "status" SET DEFAULT 'INVITED';
COMMIT;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropEnum
DROP TYPE "AuthType";

-- DropEnum
DROP TYPE "TokenType";
