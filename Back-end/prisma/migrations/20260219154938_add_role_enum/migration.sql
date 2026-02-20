/*
  Warnings:

  - Changed the type of `role` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COMPANY', 'WORKER');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;
