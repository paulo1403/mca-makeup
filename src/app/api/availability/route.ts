import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 });
    }

    const appointmentDate = new Date(date);

    // Validate date (must be today or future)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return NextResponse.json(
        { error: 'No se pueden agendar citas en fechas pasadas' },
        { status: 400 }
      );
    }

    // Get all booked appointments for the date
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: appointmentDate,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      select: {
        appointmentTime: true,
        serviceType: true,
        clientName: true,
      },
      orderBy: {
        appointmentTime: 'asc',
      },
    });

    // Check if there's any blocked availability for this date
    const blockedAvailability = await prisma.availability.findMany({
      where: {
        date: appointmentDate,
        available: false,
      },
      select: {
        startTime: true,
        endTime: true,
        notes: true,
      },
    });

    // Define default time slots
    const defaultTimeSlots = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];

    // Get custom availability for this date (if any)
    const customAvailability = await prisma.availability.findMany({
      where: {
        date: appointmentDate,
        available: true,
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Determine available slots
    let availableSlots = defaultTimeSlots;

    // If there's custom availability, use that instead
    if (customAvailability.length > 0) {
      availableSlots = [];
      customAvailability.forEach((slot) => {
        const start = parseInt(slot.startTime.split(':')[0]);
        const end = parseInt(slot.endTime.split(':')[0]);
        for (let hour = start; hour < end; hour++) {
          availableSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
      });
    }

    // Remove blocked time slots
    blockedAvailability.forEach((blocked) => {
      const start = parseInt(blocked.startTime.split(':')[0]);
      const end = parseInt(blocked.endTime.split(':')[0]);
      for (let hour = start; hour < end; hour++) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
        availableSlots = availableSlots.filter((slot) => slot !== timeSlot);
      }
    });

    // Remove booked slots
    const bookedSlots = bookedAppointments.map((apt) => apt.appointmentTime);
    const finalAvailableSlots = availableSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    // Special handling for same day appointments (can't book within 2 hours)
    const now = new Date();
    const isToday = appointmentDate.getTime() === today.getTime();

    if (isToday) {
      const currentHour = now.getHours();
      const cutoffTime = currentHour + 2; // 2 hours notice required

      const filteredSlots = finalAvailableSlots.filter((slot) => {
        const slotHour = parseInt(slot.split(':')[0]);
        return slotHour >= cutoffTime;
      });

      return NextResponse.json({
        date: date,
        availableSlots: filteredSlots,
        bookedSlots: bookedSlots,
        isToday: true,
        message:
          'Para citas del mismo día se requiere al menos 2 horas de anticipación',
      });
    }

    return NextResponse.json({
      date: date,
      availableSlots: finalAvailableSlots,
      bookedSlots: bookedSlots,
      totalSlots: availableSlots.length,
      blockedSlots: blockedAvailability.length,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
