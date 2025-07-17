-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('STUDIO', 'HOME');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "locationType" "LocationType" NOT NULL DEFAULT 'HOME';
ALTER TABLE "Appointment" ADD COLUMN "district" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "address" TEXT;
ALTER TABLE "Appointment" ADD COLUMN "addressReference" TEXT;
