import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validación
const createReviewSchema = z.object({
  clientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  clientEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
  serviceType: z.string().min(1, 'Debe especificar el tipo de servicio'),
  serviceDate: z.string().optional().or(z.literal('')),
  
  // Aspectos específicos (opcionales)
  ratingProfessionalism: z.number().min(1).max(5).optional(),
  ratingPunctuality: z.number().min(1).max(5).optional(),
  ratingQuality: z.number().min(1).max(5).optional(),
  ratingCustomerService: z.number().min(1).max(5).optional(),
  ratingValue: z.number().min(1).max(5).optional(),
  
  // Aspectos cualitativos
  whatLikedMost: z.string().optional().or(z.literal('')),
  suggestedImprovements: z.string().optional().or(z.literal('')),
  wouldRecommend: z.boolean().optional(),
  
  // Relación con cita
  appointmentId: z.string().optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos
    const validatedData = createReviewSchema.parse(body);
    
    // Convertir strings vacíos a undefined
    const cleanData = {
      ...validatedData,
      clientEmail: validatedData.clientEmail || undefined,
      serviceDate: validatedData.serviceDate ? new Date(validatedData.serviceDate) : undefined,
      whatLikedMost: validatedData.whatLikedMost || undefined,
      suggestedImprovements: validatedData.suggestedImprovements || undefined,
      appointmentId: validatedData.appointmentId || undefined,
      wouldRecommend: validatedData.wouldRecommend ?? true,
    };
    
    // Obtener metadata de la request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Crear el review
    const review = await prisma.review.create({
      data: {
        ...cleanData,
        ipAddress,
        userAgent,
        isApproved: false, // Siempre requiere aprobación
        isPublic: true,
      },
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
      message: 'Review enviado exitosamente. Será revisado antes de publicarse.',
      data: review
    });
    
  } catch (error) {
    console.error('Error creating review:', error);
    
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
      {
        success: false,
        message: 'Error interno del servidor'
      },
      { status: 500 }
    );
  }
}

// GET para obtener reviews públicos aprobados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const serviceType = searchParams.get('serviceType');
    const minRating = searchParams.get('minRating');
    
    const offset = (page - 1) * limit;
    
    const where = {
      isApproved: true,
      isPublic: true,
      ...(serviceType && { serviceType }),
      ...(minRating && { rating: { gte: parseInt(minRating) } }),
    };
    
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          clientName: true,
          rating: true,
          comment: true,
          serviceType: true,
          serviceDate: true,
          whatLikedMost: true,
          wouldRecommend: true,
          createdAt: true,
          // No incluir datos sensibles como email, phone, etc.
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
      {
        success: false,
        message: 'Error al obtener reviews'
      },
      { status: 500 }
    );
  }
}
