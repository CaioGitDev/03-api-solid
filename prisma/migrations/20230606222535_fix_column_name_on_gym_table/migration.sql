/*
  Warnings:

  - You are about to drop the column `Description` on the `gyms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gyms" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT;
