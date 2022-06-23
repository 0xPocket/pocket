-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "cryptoKnowledge" TEXT,
    "childKnowledge" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Survey_email_key" ON "Survey"("email");
