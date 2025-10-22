import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema for transport costs
const transportCostSchema = z.object({
  district: z.string().min(1, "El distrito es requerido"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  isActive: z.boolean().optional().default(true),
  notes: z.string().optional(),
});

// PUT - Actualizar costo de transporte
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = transportCostSchema.parse(body);
    const resolvedParams = await params;

    // Verificar si ya existe un distrito con ese nombre
    const existingDistrict = await prisma.transportCost.findFirst({
      where: {
        district: validatedData.district,
        NOT: { id: resolvedParams.id },
      },
    });

    if (existingDistrict) {
      return NextResponse.json(
        { error: "Ya existe un costo de transporte para este distrito" },
        { status: 400 },
      );
    }

    const transportCost = await prisma.transportCost.update({
      where: { id: resolvedParams.id },
      data: validatedData,
    });

    return NextResponse.json({
      message: "Costo de transporte actualizado exitosamente",
      transportCost,
    });
  } catch (error) {
    console.error("Error updating transport cost:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    // Handle Prisma not found error
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Costo de transporte no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// DELETE - Eliminar costo de transporte
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    await prisma.transportCost.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({
      message: "Costo de transporte eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error deleting transport cost:", error);

    // Handle Prisma not found error
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Costo de transporte no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// GET - Obtener costo de transporte específico
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const transportCost = await prisma.transportCost.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!transportCost) {
      return NextResponse.json({ error: "Costo de transporte no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ transportCost });
  } catch (error) {
    console.error("Error fetching transport cost:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
