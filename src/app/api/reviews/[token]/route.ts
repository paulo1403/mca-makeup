import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

// GET /api/reviews/[token] - Obtener review por token
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Token requerido",
        },
        { status: 400 },
      );
    }

    const review = await prisma.review.findUnique({
      where: {
        reviewToken: token,
      },
      include: {
        appointment: {
          select: {
            id: true,
            clientName: true,
            clientEmail: true,
            serviceType: true,
            appointmentDate: true,
            status: true,
            services: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          error: "Token de reseña inválido",
        },
        { status: 404 },
      );
    }

    // Verificar que la cita esté completada
    if (review.appointment.status !== "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          error: "La cita debe estar completada para dejar una reseña",
        },
        { status: 400 },
      );
    }

    // Si ya tiene rating, significa que ya fue completada
    const isCompleted = review.rating !== null;

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        appointmentId: review.appointmentId,
        reviewToken: review.reviewToken,
        rating: review.rating,
        reviewText: review.reviewText,
        reviewerName: review.reviewerName,
        reviewerEmail: review.reviewerEmail,
        isCompleted,
        appointment: {
          clientName: review.appointment.clientName,
          serviceType: review.appointment.serviceType,
          appointmentDate: review.appointment.appointmentDate,
          services: review.appointment.services,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching review by token:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al cargar la reseña",
      },
      { status: 500 },
    );
  }
}
