/*
  Warnings:

  - A unique constraint covering the columns `[workerId,jobId]` on the table `JobOffer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobOffer_workerId_jobId_key" ON "JobOffer"("workerId", "jobId");
