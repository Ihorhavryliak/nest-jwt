/*
  Warnings:

  - Added the required column `age` to the `User_information` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_information" ADD COLUMN     "age" INTEGER NOT NULL;
