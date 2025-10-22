import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

// DELETE /api/admin/reviews/[id] - Eliminar review específica
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID de reseña requerido",
        },
        { status: 400 },
      );
    }

    // Verificar que la review existe
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: {
        appointment: {
          select: {
            clientName: true,
            serviceType: true,
          },
        },
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: "Reseña no encontrada",
        },
        { status: 404 },
      );
    }

    // Eliminar la review
    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Reseña eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar la reseña",
      },
      { status: 500 },
    );
  }
}
