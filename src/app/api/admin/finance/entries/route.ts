import { type Prisma, type EntrySource, type FinanceEntryType, type PaymentMethod, type ServiceLine } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const financeEntryInputSchema = z.object({
  entryDate: z.string().datetime(),
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.number().positive(),
  category: z.string().min(1).max(60),
  serviceLine: z.enum(["MAKEUP", "NAILS", "HAIR", "GENERAL"]),
  paymentMethod: z.enum(["YAPE", "PLIN", "TRANSFER", "CASH", "CARD", "OTHER"]),
  note: z.string().max(500).nullable().optional(),
  source: z.enum(["PASTE", "MANUAL", "AI"]).optional(),
});

const createBatchSchema = z.object({
  entries: z.array(financeEntryInputSchema).min(1).max(200),
});

function mapEntry(entry: {
  id: string;
  entryDate: Date;
  type: FinanceEntryType;
  amount: number;
  category: string;
  serviceLine: ServiceLine;
  paymentMethod: PaymentMethod;
  note: string | null;
  source: EntrySource;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...entry,
    entryDate: entry.entryDate.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const type = searchParams.get("type");
    const serviceLine = searchParams.get("serviceLine");
    const search = searchParams.get("search");

    const where: Prisma.FinanceEntryWhereInput = {};

    if (from || to) {
      where.entryDate = {
        gte: from ? new Date(`${from}T00:00:00.000Z`) : undefined,
        lte: to ? new Date(`${to}T23:59:59.999Z`) : undefined,
      };
    }

    if (type === "INCOME" || type === "EXPENSE") {
      where.type = type;
    }

    if (["MAKEUP", "NAILS", "HAIR", "GENERAL"].includes(serviceLine || "")) {
      where.serviceLine = serviceLine as ServiceLine;
    }

    if (search) {
      where.OR = [
        { category: { contains: search, mode: "insensitive" } },
        { note: { contains: search, mode: "insensitive" } },
      ];
    }

    const [entries, total] = await Promise.all([
      prisma.financeEntry.findMany({
        where,
        orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.financeEntry.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        entries: entries.map(mapEntry),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching finance entries:", error);
    return NextResponse.json(
      { success: false, message: "No se pudieron cargar los movimientos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = createBatchSchema.parse(body);

    const created = await prisma.$transaction(
      payload.entries.map((entry) =>
        prisma.financeEntry.create({
          data: {
            entryDate: new Date(entry.entryDate),
            type: entry.type,
            amount: entry.amount,
            category: entry.category,
            serviceLine: entry.serviceLine,
            paymentMethod: entry.paymentMethod,
            note: entry.note || null,
            source: entry.source || "PASTE",
          },
        }),
      ),
    );

    return NextResponse.json({
      success: true,
      data: {
        entries: created.map(mapEntry),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("Error creating finance entries:", error);
    return NextResponse.json(
      { success: false, message: "No se pudieron guardar los movimientos" },
      { status: 500 },
    );
  }
}
