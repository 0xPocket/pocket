-- CreateTable
CREATE TABLE "PrivateBetaToken" (
    "token" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "PrivateBetaToken_token_key" ON "PrivateBetaToken"("token");
