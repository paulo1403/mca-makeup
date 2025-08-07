import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateReviewSchema = z.object({
  id: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  isPublic: z.boolean().optional(),
  adminResponse: z.string().optional(),
});

// GET /api/admin/reviews - Obtener todas las reviews para administración
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      where.status = status;
    }

    // Solo mostrar reviews que tienen rating (fueron completadas por el cliente)
    where.rating = {
      not: null,
    };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          appointment: {
            select: {
              id: true,
              clientName: true,
              clientEmail: true,
              serviceType: true,
              appointmentDate: true,
              services: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al cargar las reseñas'
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/reviews - Actualizar estado de review
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateReviewSchema.parse(body);

    const updateData: any = {
      status: validatedData.status,
      updatedAt: new Date(),
    };

    if (validatedData.isPublic !== undefined) {
      updateData.isPublic = validatedData.isPublic;
    }

    if (validatedData.adminResponse) {
      updateData.adminResponse = validatedData.adminResponse;
      updateData.respondedAt = new Date();
    }

    const updatedReview = await prisma.review.update({
      where: {
        id: validatedData.id,
      },
      data: updateData,
      include: {
        appointment: {
          select: {
            clientName: true,
            clientEmail: true,
            serviceType: true,
            appointmentDate: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Reseña actualizada exitosamente',
      review: updatedReview,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error('Error updating review:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar la reseña'
      },
      { status: 500 }
    );
  }
}
