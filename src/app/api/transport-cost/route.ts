import { PrismaClient } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET - Obtener costo de transporte por distrito (API pública)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get("district");

    if (!district) {
      return NextResponse.json({ error: "El parámetro 'district' es requerido" }, { status: 400 });
    }

    // Buscar el costo de transporte para el distrito específico
    const transportCost = await prisma.transportCost.findFirst({
      where: {
        district: {
          equals: district,
          mode: "insensitive", // Case insensitive search
        },
        isActive: true,
      },
      select: {
        id: true,
        district: true,
        cost: true,
        notes: true,
      },
    });

    if (!transportCost) {
      return NextResponse.json(
        {
          error: "No se encontró costo de transporte para este distrito",
          hasTransportCost: false,
          cost: 0,
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      hasTransportCost: true,
      cost: transportCost.cost,
      district: transportCost.district,
      notes: transportCost.notes,
    });
  } catch (error) {
    console.error("Error fetching transport cost:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// GET - Obtener todos los distritos disponibles (API pública)
export async function POST() {
  try {
    const districts = await prisma.transportCost.findMany({
      where: {
        isActive: true,
      },
      select: {
        district: true,
        cost: true,
        notes: true,
      },
      orderBy: {
        district: "asc",
      },
    });

    return NextResponse.json({
      districts: districts.map((d) => ({
        name: d.district,
        cost: d.cost,
        notes: d.notes,
      })),
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
