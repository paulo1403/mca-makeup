import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Validation schema for transport costs
const transportCostSchema = z.object({
  district: z.string().min(1, "El distrito es requerido"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  isActive: z.boolean().optional().default(true),
  notes: z.string().optional(),
});

// GET - Obtener todos los costos de transporte
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const transportCosts = await prisma.transportCost.findMany({
      orderBy: [{ isActive: "desc" }, { district: "asc" }],
    });

    return NextResponse.json({ transportCosts });
  } catch (error) {
    console.error("Error fetching transport costs:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST - Crear nuevo costo de transporte
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = transportCostSchema.parse(body);

    // Verificar si ya existe un distrito con ese nombre
    const existingDistrict = await prisma.transportCost.findUnique({
      where: { district: validatedData.district },
    });

    if (existingDistrict) {
      return NextResponse.json(
        { error: "Ya existe un costo de transporte para este distrito" },
        { status: 400 },
      );
    }

    const transportCost = await prisma.transportCost.create({
      data: validatedData,
    });

    return NextResponse.json(
      {
        message: "Costo de transporte creado exitosamente",
        transportCost,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating transport cost:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: error.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
