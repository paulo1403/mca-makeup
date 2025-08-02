import { NextResponse } from "next/server";
import { PrismaClient, ServiceCategory } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Verificar autenticación de admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Verificar que sea el admin principal (opcional: agregar verificación adicional)
    // if (session.user?.email !== "admin@example.com") {
    //   return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    // }

    console.log("Iniciando seed de servicios...");

    const services = [
      {
        name: "Maquillaje de Novia - Paquete Básico",
        description:
          "Paquete básico para novias incluye maquillaje el día de la boda",
        price: 480,
        duration: 150,
        category: ServiceCategory.BRIDAL,
      },
      {
        name: "Maquillaje de Novia - Paquete Clásico",
        description:
          "Paquete completo para novias incluye prueba previa y maquillaje el día de la boda",
        price: 980,
        duration: 150,
        category: ServiceCategory.BRIDAL,
      },
      {
        name: "Maquillaje Social - Estilo Natural",
        description: "Maquillaje natural para eventos sociales",
        price: 200,
        duration: 90,
        category: ServiceCategory.SOCIAL,
      },
      {
        name: "Maquillaje Social - Estilo Glam",
        description: "Maquillaje glamoroso para eventos especiales",
        price: 210,
        duration: 90,
        category: ServiceCategory.SOCIAL,
      },
      {
        name: "Maquillaje para Piel Madura",
        description: "Técnicas especializadas para piel madura",
        price: 230,
        duration: 90,
        category: ServiceCategory.MATURE_SKIN,
      },
      {
        name: "Peinados",
        description: "Peinados para eventos especiales",
        price: 65,
        duration: 60,
        category: ServiceCategory.HAIRSTYLE,
      },
    ];

    const results = [];
    for (const service of services) {
      try {
        const result = await prisma.service.upsert({
          where: { name: service.name },
          update: service,
          create: service,
        });
        results.push({
          status: "success",
          service: service.name,
          id: result.id,
        });
        console.log(`✓ Created/Updated service: ${service.name}`);
      } catch (error) {
        console.error(`Error with service ${service.name}:`, error);
        results.push({
          status: "error",
          service: service.name,
          error: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }

    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    return NextResponse.json({
      message: "Seed de servicios completado",
      summary: {
        total: services.length,
        successful: successCount,
        errors: errorCount,
      },
      details: results,
    });
  } catch (error) {
    console.error("Error ejecutando seed:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint para verificar el estado actual
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        category: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Estado actual de servicios",
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Error obteniendo servicios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
