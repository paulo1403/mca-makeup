import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ErrorSeverity, ErrorStatus, type Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");

    // Build where clause
    const where: Prisma.ErrorReportWhereInput = {};
    if (status && status !== "all" && Object.values(ErrorStatus).includes(status as ErrorStatus)) {
      where.status = status as ErrorStatus;
    }
    if (
      severity &&
      severity !== "all" &&
      Object.values(ErrorSeverity).includes(severity as ErrorSeverity)
    ) {
      where.severity = severity as ErrorSeverity;
    }

    const reports = await prisma.errorReport.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100, // Limit to 100 reports for performance
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching error reports:", error);
    return NextResponse.json({ error: "Failed to fetch error reports" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("reportId");

    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    await prisma.errorReport.delete({
      where: { id: reportId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting error report:", error);
    return NextResponse.json({ error: "Failed to delete error report" }, { status: 500 });
  }
}
