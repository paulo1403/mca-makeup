-- CreateEnum
CREATE TYPE "ErrorType" AS ENUM ('RUNTIME', 'NETWORK', 'UI', 'BOOKING', 'OTHER');

-- CreateEnum
CREATE TYPE "ErrorSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ErrorStatus" AS ENUM ('PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- AlterTable
ALTER TABLE "special_dates" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "error_reports" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "userEmail" TEXT,
    "userName" TEXT NOT NULL DEFAULT 'Usuario Anónimo',
    "errorMessage" TEXT NOT NULL,
    "errorStack" TEXT,
    "userAgent" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "userDescription" TEXT NOT NULL,
    "errorType" "ErrorType" NOT NULL,
    "severity" "ErrorSeverity" NOT NULL,
    "status" "ErrorStatus" NOT NULL DEFAULT 'PENDING',
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "error_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "error_reports_reportId_key" ON "error_reports"("reportId");
