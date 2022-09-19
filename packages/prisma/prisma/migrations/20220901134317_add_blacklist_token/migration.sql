-- CreateTable
CREATE TABLE "BlacklistToken" (
    "address" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BlacklistToken_pkey" PRIMARY KEY ("address")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistToken_address_key" ON "BlacklistToken"("address");
