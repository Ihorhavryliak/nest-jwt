/*
  Warnings:

  - The values [MANNAGER] on the enum `Roles` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Roles_new" AS ENUM ('USER', 'ADMIN', 'MANAGER');
ALTER TABLE "User" ALTER COLUMN "roles" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "roles" TYPE "Roles_new"[] USING ("roles"::text::"Roles_new"[]);
ALTER TYPE "Roles" RENAME TO "Roles_old";
ALTER TYPE "Roles_new" RENAME TO "Roles";
DROP TYPE "Roles_old";
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT ARRAY['USER']::"Roles"[];
COMMIT;
