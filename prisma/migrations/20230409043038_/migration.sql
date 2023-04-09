-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MANNAGER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "passport" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_information" (
    "id" SERIAL NOT NULL,
    "age" INTEGER NOT NULL,
    "information_id" INTEGER NOT NULL,

    CONSTRAINT "User_information_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User_information" ADD CONSTRAINT "User_information_information_id_fkey" FOREIGN KEY ("information_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
