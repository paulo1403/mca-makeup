import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type MonthlyIncomeItem = {
  month: string;
  label: string;
  total: number;
  manual: number;
  web: number;
  completedCount: number;
};

const isManualRecord = (notes: string | null) => {
  if (!notes) return false;
  return notes.includes("[REGISTRO MANUAL]") || notes.includes("[MANUAL]");
};

export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const rangeStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const completedBaseWhere = {
      status: "COMPLETED" as const,
      totalPrice: { not: null },
    };

    const manualMarkerWhere = {
      OR: [
        { additionalNotes: { contains: "[REGISTRO MANUAL]" } },
        { additionalNotes: { contains: "[MANUAL]" } },
      ],
    };

    const [
      completedForRange,
      totalAllTime,
      totalThisMonth,
      totalThisYear,
      manualAllTime,
      manualThisMonth,
      webAllTime,
      webThisMonth,
      recentManual,
    ] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          ...completedBaseWhere,
          appointmentDate: {
            gte: rangeStart,
          },
        },
        select: {
          id: true,
          clientName: true,
          serviceType: true,
          appointmentDate: true,
          totalPrice: true,
          additionalNotes: true,
        },
        orderBy: {
          appointmentDate: "asc",
        },
      }),
      prisma.appointment
        .aggregate({
          where: completedBaseWhere,
          _sum: { totalPrice: true },
        })
        .then((r) => r._sum.totalPrice || 0),
      prisma.appointment
        .aggregate({
          where: {
            ...completedBaseWhere,
            appointmentDate: { gte: monthStart },
          },
          _sum: { totalPrice: true },
        })
        .then((r) => r._sum.totalPrice || 0),
      prisma.appointment
        .aggregate({
          where: {
            ...completedBaseWhere,
            appointmentDate: { gte: yearStart },
          },
          _sum: { totalPrice: true },
        })
        .then((r) => r._sum.totalPrice || 0),
      prisma.appointment
        .aggregate({
          where: {
            ...completedBaseWhere,
            ...manualMarkerWhere,
          },
          _sum: { totalPrice: true },
        })
        .then((r) => r._sum.totalPrice || 0),
      prisma.appointment
        .aggregate({
          where: {
            ...completedBaseWhere,
            ...manualMarkerWhere,
            appointmentDate: { gte: monthStart },
          },
          _sum: { totalPrice: true },
        })
        .then((r) => r._sum.totalPrice || 0),
      prisma.appointment
        .aggregate({
          where: {
            ...completedBaseWhere,
            NOT: manualMarkerWhere,
          },
          _sum: { totalPrice: true },
        })
        .then((r) => r._sum.totalPrice || 0),
      prisma.appointment
        .aggregate({
          where: {
            ...completedBaseWhere,
            NOT: manualMarkerWhere,
            appointmentDate: { gte: monthStart },
          },
          _sum: { totalPrice: true },
        })
        .then((r) => r._sum.totalPrice || 0),
      prisma.appointment.findMany({
        where: {
          ...completedBaseWhere,
          ...manualMarkerWhere,
        },
        orderBy: {
          appointmentDate: "desc",
        },
        take: 5,
        select: {
          id: true,
          clientName: true,
          serviceType: true,
          appointmentDate: true,
          totalPrice: true,
        },
      }),
    ]);

    const monthlyMap = new Map<string, MonthlyIncomeItem>();

    for (let i = 0; i < 6; i += 1) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const month = monthDate.toISOString().slice(0, 7);
      const label = monthDate.toLocaleDateString("es-PE", {
        month: "short",
        year: "2-digit",
      });

      monthlyMap.set(month, {
        month,
        label,
        total: 0,
        manual: 0,
        web: 0,
        completedCount: 0,
      });
    }

    for (const appointment of completedForRange) {
      const month = appointment.appointmentDate.toISOString().slice(0, 7);
      const item = monthlyMap.get(month);
      if (!item) continue;

      const income = appointment.totalPrice || 0;
      const isManual = isManualRecord(appointment.additionalNotes);

      item.total += income;
      item.completedCount += 1;
      if (isManual) {
        item.manual += income;
      } else {
        item.web += income;
      }
    }

    const monthly = Array.from(monthlyMap.values());

    const topManualMonth = [...monthly].sort((a, b) => b.manual - a.manual)[0] || null;
    const topWebMonth = [...monthly].sort((a, b) => b.web - a.web)[0] || null;

    return NextResponse.json({
      success: true,
      data: {
        totals: {
          allTime: totalAllTime,
          thisMonth: totalThisMonth,
          thisYear: totalThisYear,
          manualAllTime,
          manualThisMonth,
          webAllTime,
          webThisMonth,
        },
        monthly,
        insights: {
          topManualMonth,
          topWebMonth,
        },
        recentManual,
      },
    });
  } catch (error) {
    console.error("Error fetching income summary:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch income summary" },
      { status: 500 },
    );
  }
}
