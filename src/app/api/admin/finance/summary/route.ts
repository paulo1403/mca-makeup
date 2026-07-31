import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const rangeStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      incomeAllTime,
      incomeThisMonth,
      incomeThisYear,
      expenseAllTime,
      expenseThisMonth,
      entriesForRange,
      recent,
    ] = await Promise.all([
      prisma.financeEntry
        .aggregate({
          where: { type: "INCOME" },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0),
      prisma.financeEntry
        .aggregate({
          where: { type: "INCOME", entryDate: { gte: monthStart } },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0),
      prisma.financeEntry
        .aggregate({
          where: { type: "INCOME", entryDate: { gte: yearStart } },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0),
      prisma.financeEntry
        .aggregate({
          where: { type: "EXPENSE" },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0),
      prisma.financeEntry
        .aggregate({
          where: { type: "EXPENSE", entryDate: { gte: monthStart } },
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0),
      prisma.financeEntry.findMany({
        where: { entryDate: { gte: rangeStart } },
        select: {
          entryDate: true,
          type: true,
          amount: true,
          category: true,
          note: true,
          source: true,
        },
        orderBy: { entryDate: "asc" },
      }),
      prisma.financeEntry.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          entryDate: true,
          type: true,
          amount: true,
          category: true,
          note: true,
          source: true,
        },
      }),
    ]);

    const monthlyMap = new Map<
      string,
      { month: string; label: string; income: number; expense: number; count: number }
    >();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const m = d.toISOString().slice(0, 7);
      monthlyMap.set(m, {
        month: m,
        label: d.toLocaleDateString("es-PE", { month: "short", year: "2-digit" }),
        income: 0,
        expense: 0,
        count: 0,
      });
    }

    for (const e of entriesForRange) {
      const m = e.entryDate.toISOString().slice(0, 7);
      const item = monthlyMap.get(m);
      if (!item) continue;
      item.count++;
      if (e.type === "INCOME") item.income += e.amount;
      else item.expense += e.amount;
    }

    const monthly = Array.from(monthlyMap.values());

    return NextResponse.json({
      success: true,
      data: {
        totals: {
          incomeAllTime,
          incomeThisMonth,
          incomeThisYear,
          expenseAllTime,
          expenseThisMonth,
          netAllTime: incomeAllTime - expenseAllTime,
          netThisMonth: incomeThisMonth - expenseThisMonth,
        },
        monthly,
        recent,
      },
    });
  } catch (error) {
    console.error("Error fetching finance summary:", error);
    return NextResponse.json(
      { success: false, message: "Error al cargar resumen" },
      { status: 500 },
    );
  }
}
