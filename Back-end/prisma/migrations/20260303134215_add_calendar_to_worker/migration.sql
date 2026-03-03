-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "busyDays" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "freeDays" TEXT[] DEFAULT ARRAY[]::TEXT[];
