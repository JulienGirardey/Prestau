/*
  Warnings:

  - Added the required column `phoneNumber` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "phoneNumber" VARCHAR(20) NOT NULL;
