import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimiter } from '@/lib/rateLimiter';

// POST /api/error-report - Enviar reporte de error
export async function POST(request: Request) {
  try {
    // Rate limiting para prevenir spam
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = await rateLimiter.check(
      request,
      'error-report',
      10, // máximo 10 reportes
      60 * 60 * 1000 // por hora
    );

    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: 'Too many error reports. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      userEmail,
      userName,
      errorMessage,
      errorStack,
      userAgent,
      url,
      timestamp,
      userDescription,
      errorType,
      severity,
    } = body;

    // Validación básica
    if (!userDescription || !errorType || !severity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generar ID único para el reporte
    const reportId = `ERR-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Guardar en la base de datos
    await prisma.errorReport.create({
      data: {
        reportId,
        userEmail: userEmail || null,
        userName: userName || 'Usuario Anónimo',
        errorMessage: errorMessage || 'No especificado',
        errorStack: errorStack || null,
        userAgent,
        url,
        timestamp: new Date(timestamp),
        userDescription,
        errorType,
        severity,
        status: 'PENDING',
        ipAddress: ip,
      },
    });

    // Enviar email de notificación al desarrollador (solo en producción)
    if (process.env.NODE_ENV === 'production' && process.env.DEVELOPER_EMAIL) {
      try {
        // Aquí irá la lógica de envío de email
        // Por ahora solo lo logueamos
        console.log('🚨 NUEVO REPORTE DE ERROR:', {
          reportId,
          severity,
          errorType,
          userDescription: userDescription.substring(0, 100) + '...',
          url,
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
        // No fallar el request si el email falla
      }
    }

    return NextResponse.json({
      success: true,
      reportId,
      message: 'Reporte enviado correctamente. Gracias por ayudarnos a mejorar.',
    });

  } catch (error) {
    console.error('Error processing error report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process error report' },
      { status: 500 }
    );
  }
}
