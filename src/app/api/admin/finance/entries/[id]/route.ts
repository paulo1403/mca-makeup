import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  entryDate: z.string().datetime().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  amount: z.number().positive().optional(),
  category: z.string().min(1).max(60).optional(),
  serviceLine: z.enum(["MAKEUP", "NAILS", "HAIR", "GENERAL"]).optional(),
  paymentMethod: z.enum(["YAPE", "PLIN", "TRANSFER", "CASH", "CARD", "OTHER"]).optional(),
  note: z.string().max(500).nullable().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = updateSchema.parse(body);

    const updated = await prisma.financeEntry.update({
      where: { id },
      data: {
        entryDate: payload.entryDate ? new Date(payload.entryDate) : undefined,
        type: payload.type,
        amount: payload.amount,
        category: payload.category,
        serviceLine: payload.serviceLine,
        paymentMethod: payload.paymentMethod,
        note: payload.note,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        entryDate: updated.entryDate.toISOString(),
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
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

    console.error("Error updating finance entry:", error);
    return NextResponse.json(
      { success: false, message: "No se pudo actualizar el movimiento" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.financeEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting finance entry:", error);
    return NextResponse.json(
      { success: false, message: "No se pudo eliminar el movimiento" },
      { status: 500 },
    );
  }
}
