/*
  Warnings:

  - A unique constraint covering the columns `[dayOfWeek,startTime,endTime,locationType]` on the table `regular_availability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "regular_availability_dayOfWeek_startTime_endTime_key";

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "services" JSONB,
ADD COLUMN     "totalDuration" INTEGER,
ALTER COLUMN "serviceType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "regular_availability" ADD COLUMN     "locationType" "LocationType" NOT NULL DEFAULT 'STUDIO';

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "reviewToken" TEXT NOT NULL,
    "rating" INTEGER,
    "reviewText" TEXT,
    "reviewerName" TEXT NOT NULL,
    "reviewerEmail" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "adminResponse" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "push_subscriptions_userId_key" ON "push_subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_appointmentId_key" ON "reviews"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_reviewToken_key" ON "reviews"("reviewToken");

-- CreateIndex
CREATE UNIQUE INDEX "regular_availability_dayOfWeek_startTime_endTime_locationTy_key" ON "regular_availability"("dayOfWeek", "startTime", "endTime", "locationType");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
