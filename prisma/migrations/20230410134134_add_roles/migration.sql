/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'ADMIN', 'MANNAGER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "roles" "Roles"[] DEFAULT ARRAY['USER']::"Roles"[];

-- DropEnum
DROP TYPE "Role";
