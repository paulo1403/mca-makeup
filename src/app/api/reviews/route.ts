import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createReviewSchema = z.object({
  reviewToken: z.string(),
  rating: z.number().min(1).max(5),
  reviewText: z.string().optional(),
  reviewerName: z.string().min(1),
  reviewerEmail: z.string().email(),
});

// GET /api/reviews - Obtener reviews públicas aprobadas
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        status: "APPROVED",
        isPublic: true,
      },
      include: {
        appointment: {
          select: {
            serviceType: true,
            appointmentDate: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al cargar las reseñas",
      },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Crear nueva review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);

    // Verificar que el token sea válido y la cita exista
    const appointment = await prisma.appointment.findFirst({
      where: {
        status: "COMPLETED",
        review: {
          reviewToken: validatedData.reviewToken,
        },
      },
      include: {
        review: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        {
          success: false,
          error: "Token de reseña inválido o cita no encontrada",
        },
        { status: 404 }
      );
    }

    // Verificar si ya existe una review para esta cita
    if (appointment.review && appointment.review.rating !== null) {
      return NextResponse.json(
        {
          success: false,
          error: "Ya existe una reseña para esta cita",
        },
        { status: 409 }
      );
    }

    // Actualizar la review existente con los datos del cliente
    const updatedReview = await prisma.review.update({
      where: {
        reviewToken: validatedData.reviewToken,
      },
      data: {
        rating: validatedData.rating,
        reviewText: validatedData.reviewText,
        reviewerName: validatedData.reviewerName,
        reviewerEmail: validatedData.reviewerEmail,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message:
        "Reseña enviada exitosamente. Será revisada antes de publicarse.",
      review: updatedReview,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Error creating review:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al enviar la reseña",
      },
      { status: 500 }
    );
  }
}
