import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("=== DIAGNÓSTICO DE BASE DE DATOS ===");

    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("Usuario autenticado:", session.user?.email);

    // Verificar variable de entorno
    const dbUrl = process.env.DATABASE_URL;
    console.log("DATABASE_URL presente:", dbUrl ? "Sí" : "No");
    if (dbUrl) {
      console.log(
        "DATABASE_URL (primeros 50 chars):",
        dbUrl.substring(0, 50) + "...",
      );
    }

    // Test 1: Conexión básica
    console.log("Probando conexión básica a la base de datos...");
    await prisma.$connect();
    console.log("✓ Conexión exitosa");

    // Test 2: Query simple
    console.log("Probando query simple...");
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✓ Query simple exitosa:", result);

    // Test 3: Verificar si existe la tabla Service
    console.log("Verificando tabla Service...");
    let serviceCount = 0;
    let serviceTableExists = false;
    try {
      serviceCount = await prisma.service.count();
      serviceTableExists = true;
      console.log("✓ Tabla Service existe, registros:", serviceCount);
    } catch (tableError) {
      console.error("✗ Error con tabla Service:", tableError);
      return NextResponse.json(
        {
          error: "Tabla Service no existe o hay problema de schema",
          details:
            tableError instanceof Error
              ? tableError.message
              : "Error desconocido",
          suggestion: "Ejecutar: npx prisma migrate deploy",
        },
        { status: 500 },
      );
    }

    // Test 4: Verificar otras tablas críticas
    console.log("Verificando otras tablas...");
    const appointmentCount = await prisma.appointment.count();
    const userCount = await prisma.user.count();

    console.log("✓ Tabla Appointment:", appointmentCount, "registros");
    console.log("✓ Tabla User:", userCount, "registros");

    return NextResponse.json({
      status: "success",
      message: "Diagnóstico completado exitosamente",
      database: {
        connected: true,
        url_present: !!dbUrl,
        tables: {
          service: serviceTableExists ? serviceCount : "No existe",
          appointment: appointmentCount,
          user: userCount,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("=== ERROR EN DIAGNÓSTICO ===");
    console.error("Error:", error);
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");

    return NextResponse.json(
      {
        error: "Error en diagnóstico de base de datos",
        details: error instanceof Error ? error.message : "Error desconocido",
        stack: error instanceof Error ? error.stack : "No stack trace",
        database_url_present: !!process.env.DATABASE_URL,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
