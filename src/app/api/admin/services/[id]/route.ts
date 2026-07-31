import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const imagesInclude = { images: { orderBy: { sortOrder: Prisma.SortOrder.asc } } };

// GET - Obtener un servicio específico
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({ where: { id }, include: imagesInclude });
    if (!service) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
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
    const { name, description, price, duration, category, isActive, cost, videoUrl, images } =
      body;

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
        { error: "Precio y duración deben ser mayores o igual a 0" },
        { status: 400 },
      );
    }

    const existingService = await prisma.service.findUnique({ where: { id } });
    if (!existingService) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    const duplicateService = await prisma.service.findFirst({
      where: { name, id: { not: id } },
    });
    if (duplicateService) {
      return NextResponse.json(
        { error: "Ya existe otro servicio con este nombre" },
        { status: 400 },
      );
    }

    const gallery = Array.isArray(images) ? images : [];
    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        price: Number.parseFloat(price),
        duration: Number.parseInt(duration, 10),
        category,
        isActive: isActive !== undefined ? isActive : true,
        cost: cost !== undefined && cost !== "" ? Number.parseFloat(cost) : null,
        videoUrl: videoUrl || null,
        images: {
          deleteMany: {},
          create: gallery.map(
            (img: { url: string; isPrimary?: boolean; alt?: string }, i: number) => ({
              url: img.url,
              isPrimary: !!img.isPrimary,
              alt: img.alt || null,
              sortOrder: i,
            }),
          ),
        },
      },
      include: imagesInclude,
    });

    return NextResponse.json({ message: "Servicio actualizado exitosamente", service });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// DELETE - Eliminar un servicio
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const existingService = await prisma.service.findUnique({ where: { id } });
    if (!existingService) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    const appointmentsCount = await prisma.appointment.count({
      where: {
        serviceType: existingService.name,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });
    if (appointmentsCount > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar: tiene citas pendientes o confirmadas" },
        { status: 400 },
      );
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ message: "Servicio eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
