-- AlterTable
ALTER TABLE "Parent" ADD COLUMN     "maticGrants" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "MaticGrant" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" TEXT NOT NULL,
    "hash" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MaticGrant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaticGrant" ADD CONSTRAINT "MaticGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
