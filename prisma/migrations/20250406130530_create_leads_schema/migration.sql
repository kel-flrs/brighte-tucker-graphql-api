-- CreateTable
CREATE TABLE "leads" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "services" TEXT[],

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");
