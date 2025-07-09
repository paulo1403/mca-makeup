import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/availability - Get availability settings
export async function GET() {
  try {
    const timeSlots = await prisma.regularAvailability.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });

    const specialDates = await prisma.specialDate.findMany({
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({
      success: true,
      timeSlots,
      specialDates,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, message: 'Error al cargar la disponibilidad' },
      { status: 500 }
    );
  }
}

// POST /api/admin/availability - Create availability slot or special date
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'timeSlot') {
      const { dayOfWeek, startTime, endTime } = data;

      // Validate required fields
      if (dayOfWeek === undefined || !startTime || !endTime) {
        return NextResponse.json(
          {
            success: false,
            message: 'Día de la semana, hora de inicio y hora de fin son requeridos',
          },
          { status: 400 }
        );
      }

      // Validate time format and logic
      if (startTime >= endTime) {
        return NextResponse.json(
          {
            success: false,
            message: 'La hora de inicio debe ser anterior a la hora de fin',
          },
          { status: 400 }
        );
      }

      // Check for overlapping time slots on the same day
      const overlapping = await prisma.regularAvailability.findFirst({
        where: {
          dayOfWeek,
          isActive: true,
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } }
              ]
            }
          ]
        }
      });

      if (overlapping) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ya existe un horario que se superpone con el que intentas agregar',
          },
          { status: 400 }
        );
      }

      // Create the time slot
      const timeSlot = await prisma.regularAvailability.create({
        data: {
          dayOfWeek,
          startTime,
          endTime,
        },
      });

      return NextResponse.json({
        success: true,
        ...timeSlot,
      });

    } else if (type === 'specialDate') {
      const { date, isAvailable, customHours, note } = data;

      // Validate required fields
      if (!date) {
        return NextResponse.json(
          {
            success: false,
            message: 'La fecha es requerida',
          },
          { status: 400 }
        );
      }

      // Validate custom hours if available
      if (isAvailable && customHours) {
        if (!customHours.startTime || !customHours.endTime) {
          return NextResponse.json(
            {
              success: false,
              message: 'Para fechas disponibles, hora de inicio y fin son requeridas',
            },
            { status: 400 }
          );
        }

        if (customHours.startTime >= customHours.endTime) {
          return NextResponse.json(
            {
              success: false,
              message: 'La hora de inicio debe ser anterior a la hora de fin',
            },
            { status: 400 }
          );
        }
      }

      // Create the special date
      const specialDate = await prisma.specialDate.create({
        data: {
          date: new Date(date),
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

    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Tipo de solicitud no válido',
        },
        { status: 400 }
      );
    }

  } catch (error: unknown) {
    console.error('Error creating availability:', error);
    
    // Handle unique constraint violations
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      const prismaError = error as { meta?: { target?: string[] } };
      if (prismaError.meta?.target?.includes('dayOfWeek')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ya existe un horario para este día con esos horarios',
          },
          { status: 400 }
        );
      } else if (prismaError.meta?.target?.includes('date')) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ya existe una configuración especial para esta fecha',
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: 'Error al crear la disponibilidad' },
      { status: 500 }
    );
  }
}
