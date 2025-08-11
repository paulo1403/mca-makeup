import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Obtener todos los servicios
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// POST - Crear nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, duration, category, isActive } = body;

    // Validaciones
    if (
      !name ||
      price === undefined ||
      price === null ||
      price === "" ||
      duration === undefined ||
      duration === null ||
      duration === "" ||
      !category
    ) {
      return NextResponse.json(
        { error: "Nombre, precio, duración y categoría son requeridos" },
        { status: 400 },
      );
    }

    if (price < 0 || duration < 0) {
      return NextResponse.json(
        {
          error:
            "Precio debe ser mayor o igual a 0 y duración debe ser mayor o igual a 0",
        },
        { status: 400 },
      );
    }

    // Verificar que el nombre no exista
    const existingService = await prisma.service.findUnique({
      where: { name },
    });

    if (existingService) {
      return NextResponse.json(
        { error: "Ya existe un servicio con este nombre" },
        { status: 400 },
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        category,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      message: "Servicio creado exitosamente",
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
