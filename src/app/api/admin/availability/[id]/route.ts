import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

// PATCH /api/admin/availability/[id] - Update time slot (toggle active/inactive)
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "isActive debe ser un valor booleano",
        },
        { status: 400 },
      );
    }

    // Update the time slot
    const timeSlot = await prisma.regularAvailability.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({
      success: true,
      ...timeSlot,
    });
  } catch (error) {
    console.error("Error updating time slot:", error);

    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Horario no encontrado",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Error al actualizar el horario" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/availability/[id] - Delete time slot
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Delete the time slot
    await prisma.regularAvailability.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Horario eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error deleting time slot:", error);

    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Horario no encontrado",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Error al eliminar el horario" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/availability/[id] - Update complete time slot data
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { dayOfWeek, startTime, endTime, locationType } = body;

    // Validation
    if (typeof dayOfWeek !== "number" || dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json(
        {
          success: false,
          message: "dayOfWeek debe ser un número entre 0 y 6",
        },
        { status: 400 },
      );
    }

    if (!startTime || !endTime) {
      return NextResponse.json(
        {
          success: false,
          message: "startTime y endTime son requeridos",
        },
        { status: 400 },
      );
    }

    if (!locationType || !["STUDIO", "HOME"].includes(locationType)) {
      return NextResponse.json(
        {
          success: false,
          message: "locationType debe ser STUDIO o HOME",
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

    // Check for overlapping slots (only within the same location type)
    const existingSlots = await prisma.regularAvailability.findMany({
      where: {
        dayOfWeek,
        locationType,
        isActive: true,
        id: { not: id }, // Exclude current slot from check
      },
    });

    const hasOverlap = existingSlots.some((slot) => {
      return startTime < slot.endTime && endTime > slot.startTime;
    });

    if (hasOverlap) {
      return NextResponse.json(
        {
          success: false,
          message: "El horario se superpone con otro existente",
        },
        { status: 400 },
      );
    }

    // Update the time slot
    const timeSlot = await prisma.regularAvailability.update({
      where: { id },
      data: { dayOfWeek, startTime, endTime, locationType },
    });

    return NextResponse.json({
      success: true,
      ...timeSlot,
    });
  } catch (error) {
    console.error("Error updating time slot:", error);

    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        {
          success: false,
          message: "Horario no encontrado",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Error al actualizar el horario" },
      { status: 500 },
    );
  }
}
