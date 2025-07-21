/*
  Warnings:

  - You are about to drop the column `location` on the `appointments` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('STUDIO', 'HOME');

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "location",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "addressReference" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "locationType" "LocationType" NOT NULL DEFAULT 'HOME',
ADD COLUMN     "price" DOUBLE PRECISION;
