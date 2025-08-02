import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Obtener todos los servicios activos (API pública)
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { category: "asc" },
        { price: "asc" }
      ],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        category: true,
      },
    });

    // Agrupar servicios por categoría para mejor organización
    const servicesByCategory = services.reduce((acc, service) => {
      const category = service.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {} as Record<string, typeof services>);

    return NextResponse.json({
      services,
      servicesByCategory
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
