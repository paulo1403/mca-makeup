import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  try {
    console.log("Iniciando proceso de migración...");

    // Verificar autenticación de admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("Usuario autenticado:", session.user?.email);

    // Verificar variable de entorno de base de datos
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "DATABASE_URL no configurada" },
        { status: 500 }
      );
    }

    console.log("Ejecutando migraciones de Prisma...");

    try {
      // Ejecutar migrate deploy
      const { stdout, stderr } = await execAsync("npx prisma migrate deploy", {
        env: { ...process.env },
        timeout: 60000, // 60 segundos timeout
      });

      console.log("Stdout:", stdout);
      if (stderr) {
        console.log("Stderr:", stderr);
      }

      // Verificar si las migraciones fueron exitosas
      const successIndicators = [
        "migration(s) have been applied",
        "No pending migrations to apply",
        "Database is up to date"
      ];

      const isSuccess = successIndicators.some(indicator =>
        stdout.includes(indicator) || stderr.includes(indicator)
      );

      if (isSuccess) {
        return NextResponse.json({
          success: true,
          message: "Migraciones ejecutadas exitosamente",
          output: stdout,
          stderr: stderr || null,
          timestamp: new Date().toISOString()
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Las migraciones no se completaron correctamente",
          output: stdout,
          stderr: stderr || null,
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }

    } catch (execError) {
      console.error("Error ejecutando migración:", execError);

      return NextResponse.json({
        success: false,
        error: "Error ejecutando migraciones",
        details: execError instanceof Error ? execError.message : "Error desconocido",
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error general en migración:", error);
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor",
      details: error instanceof Error ? error.message : "Error desconocido",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET endpoint para verificar el estado de las migraciones
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    console.log("Verificando estado de migraciones...");

    const { stdout, stderr } = await execAsync("npx prisma migrate status", {
      env: { ...process.env },
      timeout: 30000,
    });

    return NextResponse.json({
      status: "success",
      message: "Estado de migraciones obtenido",
      output: stdout,
      stderr: stderr || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error verificando estado de migraciones:", error);
    return NextResponse.json({
      error: "Error verificando estado de migraciones",
      details: error instanceof Error ? error.message : "Error desconocido",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
