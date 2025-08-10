import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Obtener un servicio específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar un servicio
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, price, duration, category, isActive } = body;

    // Validaciones
    if (
      !name ||
      price === undefined ||
      price === null ||
      price === "" ||
      !duration ||
      !category
    ) {
      return NextResponse.json(
        { error: "Nombre, precio, duración y categoría son requeridos" },
        { status: 400 },
      );
    }

    if (price < 0 || duration <= 0) {
      return NextResponse.json(
        {
          error:
            "Precio debe ser mayor o igual a 0 y duración debe ser mayor a 0",
        },
        { status: 400 },
      );
    }

    // Verificar que el servicio existe
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 },
      );
    }

    // Verificar que el nombre no exista en otro servicio
    const duplicateService = await prisma.service.findFirst({
      where: {
        name,
        id: { not: id },
      },
    });

    if (duplicateService) {
      return NextResponse.json(
        { error: "Ya existe otro servicio con este nombre" },
        { status: 400 },
      );
    }

    const service = await prisma.service.update({
      where: { id },
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
      message: "Servicio actualizado exitosamente",
      service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

// DELETE - Eliminar un servicio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    // Verificar que el servicio existe
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 },
      );
    }

    // Verificar si hay citas que usan este servicio
    const appointmentsCount = await prisma.appointment.count({
      where: {
        serviceType: existingService.name,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (appointmentsCount > 0) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar el servicio porque tiene citas pendientes o confirmadas",
        },
        { status: 400 },
      );
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Servicio eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
