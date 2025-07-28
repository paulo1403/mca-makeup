import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceType = searchParams.get('serviceType');
    const locationType = searchParams.get('locationType');

    if (!date || !serviceType || !locationType) {
      return NextResponse.json({ error: 'Fecha, tipo de servicio y ubicación requeridos' }, { status: 400 });
    }


    // Parse date as local (Lima) date, not UTC
    let appointmentDate: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      // If date is in 'YYYY-MM-DD' format, parse as local
      const [year, month, day] = date.split('-').map(Number);
      appointmentDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    } else {
      // Fallback to default parsing
      appointmentDate = new Date(date);
    }

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
        locationType: true,
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

    // Define default time slots (start times)
    // Generar slots según tipo de ubicación
    function generateTimeSlots(start: string, end: string, interval: number) {
      const slots = [];
      let [h, m] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      while (h < endH || (h === endH && m <= endM)) {
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        m += interval;
        while (m >= 60) { h++; m -= 60; }
      }
      return slots;
    }
    let defaultTimeSlots: string[] = [];
    if (locationType === 'STUDIO') {
      // Estudio: 8:00 a 17:00 (máximo salida 18:30)
      defaultTimeSlots = generateTimeSlots('08:00', '17:00', 90);
    } else {
      // Domicilio: 3:00 a 20:00
      defaultTimeSlots = generateTimeSlots('03:00', '20:00', 90);
    }

    // Service durations in minutes
    const serviceDurations: Record<string, number> = {
      'Maquillaje de Novia - Paquete Básico (S/ 480)': 150,
      'Maquillaje de Novia - Paquete Clásico (S/ 980)': 150,
      'Maquillaje Social - Estilo Natural (S/ 200)': 90,
      'Maquillaje Social - Estilo Glam (S/ 210)': 90,
      'Maquillaje para Piel Madura (S/ 230)': 90,
    };
    const selectedDuration = serviceDurations[serviceType] || 90;
    // transportTime is not needed, logic is handled inline below

    // Generate available ranges
    function addMinutes(time: string, mins: number) {
      const [h, m] = time.split(':').map(Number);
      const date = new Date(1970, 0, 1, h, m);
      date.setMinutes(date.getMinutes() + mins);
      return date.toTimeString().slice(0,5);
    }

    let availableRanges: string[] = [];
    for (const slot of defaultTimeSlots) {
      const end = addMinutes(slot, selectedDuration);
      availableRanges.push(`${slot} - ${end}`);
    }

    // Remove ranges that overlap with booked appointments (considering duration and transport)
    availableRanges = availableRanges.filter((range) => {
      const [start, end] = range.split(' - ');
      for (const booked of bookedAppointments) {
        const bookedStart = booked.appointmentTime.split(' - ')[0];
        const bookedEnd = booked.appointmentTime.split(' - ')[1];
        // Calculate block window for booked appointment
        let bookedBlockStart = bookedStart;
        let bookedBlockEnd = bookedEnd;
        if (booked.locationType === 'HOME') {
          // Block 1h before and after for transport
          bookedBlockStart = addMinutes(bookedStart, -60);
          bookedBlockEnd = addMinutes(bookedEnd, 60);
        }
        // If new range overlaps with block window, exclude
        if (!(end <= bookedBlockStart || start >= bookedBlockEnd)) {
          return false;
        }
      }
      return true;
    });

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

    // Special handling for same day appointments (can't book within 2 hours)
    const now = new Date();
    const isToday = appointmentDate.getTime() === today.getTime();

    if (isToday) {
      const currentHour = now.getHours();
      const cutoffTime = currentHour + 2; // 2 hours notice required
      availableRanges = availableRanges.filter((range) => {
        const slotHour = parseInt(range.split(' - ')[0].split(':')[0]);
        return slotHour >= cutoffTime;
      });
      return NextResponse.json({
        date: date,
        availableRanges,
        isToday: true,
        message:
          'Para citas del mismo día se requiere al menos 2 horas de anticipación',
      });
    }

    return NextResponse.json({
      date: date,
      availableRanges,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
