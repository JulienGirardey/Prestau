/*
  Warnings:

  - You are about to drop the column `applicationDate` on the `JobOffer` table. All the data in the column will be lost.
  - You are about to drop the column `selected_at` on the `JobOffer` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Users` table. All the data in the column will be lost.
  - Changed the type of `postalCode` on the `Worker` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "JobOffer" DROP COLUMN "applicationDate",
DROP COLUMN "selected_at";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "is_active";

-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "postalCode",
ADD COLUMN     "postalCode" INTEGER NOT NULL;
