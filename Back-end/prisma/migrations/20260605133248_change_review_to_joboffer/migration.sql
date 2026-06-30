/*
  Warnings:

  - You are about to drop the column `jobId` on the `Review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_jobId_fkey";

-- DropIndex
DROP INDEX "idx_review_jobId";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "jobId",
ADD COLUMN     "jobOfferId" INTEGER;

-- CreateIndex
CREATE INDEX "idx_review_jobOfferId" ON "Review"("jobOfferId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "JobOffer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
