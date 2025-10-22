import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

// PUT /api/admin/availability/special/[id] - Update special date
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { date, isAvailable, customHours, note } = body;

    // Validation
    if (!date) {
      return NextResponse.json(
        {
          success: false,
          message: "Fecha es requerida",
        },
        { status: 400 },
      );
    }

    if (typeof isAvailable !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "isAvailable debe ser un valor booleano",
        },
        { status: 400 },
      );
    }

    // Validate time format if available
    if (isAvailable && customHours) {
      const { startTime, endTime } = customHours;
      if (!startTime || !endTime) {
        return NextResponse.json(
          {
            success: false,
            message: "Para fechas disponibles, las horas son requeridas",
          },
          { status: 400 },
        );
      }

      if (startTime >= endTime) {
        return NextResponse.json(
          {
            success: false,
            message: "La hora de inicio debe ser anterior a la hora de fin",
          },
          { status: 400 },
        );
      }
    }

    // Update the special date
    const specialDate = await prisma.specialDate.update({
      where: { id },
      data: {
        date,
        isAvailable,
        startTime: isAvailable && customHours ? customHours.startTime : null,
        endTime: isAvailable && customHours ? customHours.endTime : null,
        note: note || null,
      },
    });

    return NextResponse.json({
      success: true,
      ...specialDate,
    });
  } catch (error) {
    console.error("Error updating special date:", error);

    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Fecha especial no encontrada",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Error al actualizar la fecha especial" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/availability/special/[id] - Delete special date
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Delete the special date
    await prisma.specialDate.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Fecha especial eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting special date:", error);

    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Fecha especial no encontrada",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Error al eliminar la fecha especial" },
      { status: 500 },
    );
  }
}
