import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));

    const fromDate = from ? new Date(`${from}T00:00:00.000Z`) : undefined;
    const toDate = to ? new Date(`${to}T23:59:59.999Z`) : undefined;
    const globalDateFilter = {
      gte: fromDate,
      lte: toDate,
    };
    const thisMonthStart = fromDate && fromDate > monthStart ? fromDate : monthStart;

    const thisMonthEntries = await prisma.financeEntry.findMany({
      where: {
        entryDate: {
          gte: thisMonthStart,
          lte: toDate,
        },
      },
      select: {
        amount: true,
        type: true,
      },
    });

    const allEntries = await prisma.financeEntry.findMany({
      where: {
        entryDate: globalDateFilter,
      },
      select: {
        entryDate: true,
        amount: true,
        type: true,
        serviceLine: true,
        category: true,
      },
      orderBy: {
        entryDate: "asc",
      },
    });

    const thisMonthIncome = thisMonthEntries
      .filter((item) => item.type === "INCOME")
      .reduce((sum, item) => sum + item.amount, 0);

    const thisMonthExpense = thisMonthEntries
      .filter((item) => item.type === "EXPENSE")
      .reduce((sum, item) => sum + item.amount, 0);

    const allTimeIncome = allEntries
      .filter((item) => item.type === "INCOME")
      .reduce((sum, item) => sum + item.amount, 0);

    const allTimeExpense = allEntries
      .filter((item) => item.type === "EXPENSE")
      .reduce((sum, item) => sum + item.amount, 0);

    const byServiceLineMap = new Map<
      string,
      { serviceLine: string; income: number; expense: number; net: number }
    >();

    const byCategoryMap = new Map<string, { category: string; income: number; expense: number; net: number }>();
    const dailyMap = new Map<string, { day: string; income: number; expense: number; net: number }>();

    for (const item of allEntries) {
      const serviceLine = item.serviceLine;
      const category = item.category;
      const day = item.entryDate.toISOString().slice(0, 10);

      const serviceLineRow = byServiceLineMap.get(serviceLine) || {
        serviceLine,
        income: 0,
        expense: 0,
        net: 0,
      };

      const categoryRow = byCategoryMap.get(category) || {
        category,
        income: 0,
        expense: 0,
        net: 0,
      };

      const dailyRow = dailyMap.get(day) || {
        day,
        income: 0,
        expense: 0,
        net: 0,
      };

      if (item.type === "INCOME") {
        serviceLineRow.income += item.amount;
        categoryRow.income += item.amount;
        dailyRow.income += item.amount;
      } else {
        serviceLineRow.expense += item.amount;
        categoryRow.expense += item.amount;
        dailyRow.expense += item.amount;
      }

      serviceLineRow.net = serviceLineRow.income - serviceLineRow.expense;
      categoryRow.net = categoryRow.income - categoryRow.expense;
      dailyRow.net = dailyRow.income - dailyRow.expense;

      byServiceLineMap.set(serviceLine, serviceLineRow);
      byCategoryMap.set(category, categoryRow);
      dailyMap.set(day, dailyRow);
    }

    return NextResponse.json({
      success: true,
      data: {
        totals: {
          thisMonthIncome,
          thisMonthExpense,
          thisMonthNet: thisMonthIncome - thisMonthExpense,
          allTimeIncome,
          allTimeExpense,
          allTimeNet: allTimeIncome - allTimeExpense,
        },
        byServiceLine: Array.from(byServiceLineMap.values()).sort((a, b) => b.net - a.net),
        byCategory: Array.from(byCategoryMap.values()).sort((a, b) => b.net - a.net),
        daily: Array.from(dailyMap.values()).slice(-30),
      },
    });
  } catch (error) {
    console.error("Error fetching finance stats:", error);
    return NextResponse.json(
      {
        success: false,
        message: "No se pudieron cargar las métricas financieras",
      },
      { status: 500 },
    );
  }
}
