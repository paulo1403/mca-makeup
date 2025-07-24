import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validación para update
const updateReviewSchema = z.object({
  id: z.string(),
  isApproved: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  moderationNotes: z.string().optional(),
});

// GET - Obtener todos los reviews (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const isApproved = searchParams.get('isApproved');
    const rating = searchParams.get('rating');
    const serviceType = searchParams.get('serviceType');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const offset = (page - 1) * limit;
    
    const where: {
      isApproved?: boolean;
      rating?: number;
      serviceType?: string;
      OR?: Array<{
        clientName?: { contains: string; mode: 'insensitive' };
        comment?: { contains: string; mode: 'insensitive' };
        clientEmail?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};
    
    if (isApproved !== null && isApproved !== undefined) {
      where.isApproved = isApproved === 'true';
    }
    
    if (rating) {
      where.rating = parseInt(rating);
    }
    
    if (serviceType) {
      where.serviceType = serviceType;
    }
    
    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
        { clientEmail: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
        include: {
          appointment: {
            select: {
              id: true,
              clientName: true,
              serviceType: true,
              appointmentDate: true,
            }
          }
        }
      }),
      prisma.review.count({ where })
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener reviews' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar review (aprobar/rechazar, moderar)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const validatedData = updateReviewSchema.parse(body);
    
    const updateData: {
      isApproved?: boolean;
      approvedAt?: Date;
      isPublic?: boolean;
      moderationNotes?: string;
      updatedAt?: Date;
    } = {};
    
    if (validatedData.isApproved !== undefined) {
      updateData.isApproved = validatedData.isApproved;
      if (validatedData.isApproved) {
        updateData.approvedAt = new Date();
      }
    }
    
    if (validatedData.isPublic !== undefined) {
      updateData.isPublic = validatedData.isPublic;
    }
    
    if (validatedData.moderationNotes !== undefined) {
      updateData.moderationNotes = validatedData.moderationNotes;
    }
    
    updateData.updatedAt = new Date();
    
    const review = await prisma.review.update({
      where: { id: validatedData.id },
      data: updateData,
      include: {
        appointment: {
          select: {
            id: true,
            clientName: true,
            serviceType: true,
            appointmentDate: true,
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Review actualizado exitosamente',
      data: review
    });
    
  } catch (error) {
    console.error('Error updating review:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Datos inválidos',
          errors: error.errors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Error al actualizar review' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar review
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID requerido' },
        { status: 400 }
      );
    }
    
    await prisma.review.delete({
      where: { id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Review eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, message: 'Error al eliminar review' },
      { status: 500 }
    );
  }
}
