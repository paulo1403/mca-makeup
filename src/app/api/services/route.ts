import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET - Obtener todos los servicios activos (API pública)
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { price: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        category: true,
        cost: true,
        videoUrl: true,
        images: {
          orderBy: { sortOrder: Prisma.SortOrder.asc },
          select: { id: true, url: true, alt: true, isPrimary: true, sortOrder: true },
        },
      },
    });

    const servicesByCategory = services.reduce(
      (acc, service) => {
        const category = service.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(service);
        return acc;
      },
      {} as Record<string, typeof services>,
    );

    return NextResponse.json({ services, servicesByCategory });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
