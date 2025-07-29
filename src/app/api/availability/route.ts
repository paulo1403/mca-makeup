import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const serviceType = searchParams.get("serviceType");
    const locationType = searchParams.get("locationType");

    if (!date || !serviceType || !locationType) {
      return NextResponse.json(
        { error: "Fecha, tipo de servicio y ubicación requeridos" },
        { status: 400 },
      );
    }

    // Parse date to match database storage format (2025-08-03T17:00:00.000Z)
    let appointmentDate: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      appointmentDate = new Date(`${date}T17:00:00.000Z`);
    } else {
      appointmentDate = new Date(date);
    }

    // Validate date (must be today or future)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(appointmentDate);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate < today) {
      return NextResponse.json(
        { error: "No se pueden agendar citas en fechas pasadas" },
        { status: 400 },
      );
    }

    // Get all booked appointments for the date
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: appointmentDate,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      select: {
        appointmentTime: true,
        serviceType: true,
        locationType: true,
      },
      orderBy: {
        appointmentTime: "asc",
      },
    });

    // Generate time slots based on location type
    function generateTimeSlots(start: string, end: string, interval: number) {
      const slots = [];
      let [h, m] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);
      while (h < endH || (h === endH && m <= endM)) {
        slots.push(
          `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
        );
        m += interval;
        while (m >= 60) {
          h++;
          m -= 60;
        }
      }
      return slots;
    }

    let defaultTimeSlots: string[] = [];
    if (locationType === "STUDIO") {
      // Studio: 8:00 a 17:00
      defaultTimeSlots = generateTimeSlots("08:00", "17:00", 90);
    } else {
      // Home: 3:00 a 20:00
      defaultTimeSlots = generateTimeSlots("03:00", "20:00", 90);
    }

    // Service durations in minutes
    const serviceDurations: Record<string, number> = {
      "Maquillaje de Novia - Paquete Básico (S/ 480)": 150,
      "Maquillaje de Novia - Paquete Clásico (S/ 980)": 150,
      "Maquillaje Social - Estilo Natural (S/ 200)": 90,
      "Maquillaje Social - Estilo Glam (S/ 210)": 90,
      "Maquillaje para Piel Madura (S/ 230)": 90,
    };
    const selectedDuration = serviceDurations[serviceType] || 90;

    // Generate available ranges
    function addMinutes(time: string, mins: number) {
      const [h, m] = time.split(":").map(Number);
      const date = new Date(1970, 0, 1, h, m);
      date.setMinutes(date.getMinutes() + mins);
      return date.toTimeString().slice(0, 5);
    }

    let availableRanges: string[] = [];
    for (const slot of defaultTimeSlots) {
      const end = addMinutes(slot, selectedDuration);
      availableRanges.push(`${slot} - ${end}`);
    }

    // Remove ranges that overlap with booked appointments (considering transport time)
    availableRanges = availableRanges.filter((range) => {
      const [start, end] = range.split(" - ");

      for (const booked of bookedAppointments) {
        const bookedStart = booked.appointmentTime.split(" - ")[0];
        const bookedEnd = booked.appointmentTime.split(" - ")[1];
        let bookedBlockStart = bookedStart;
        let bookedBlockEnd = bookedEnd;

        // Transport time logic
        if (booked.locationType !== locationType) {
          // Different locations: block 1h before and after for transport
          bookedBlockStart = addMinutes(bookedStart, -60);
          bookedBlockEnd = addMinutes(bookedEnd, 60);
        } else if (booked.locationType === "HOME") {
          // Both home services: block 1h before and after for transport
          bookedBlockStart = addMinutes(bookedStart, -60);
          bookedBlockEnd = addMinutes(bookedEnd, 60);
        }
        // If same studio location, no extra time needed

        // Check for overlap: if ranges overlap, exclude this slot
        if (!(end <= bookedBlockStart || start >= bookedBlockEnd)) {
          return false; // This range overlaps, exclude it
        }
      }

      return true; // No overlaps, keep this range
    });

    // Check for blocked availability (custom admin blocks)
    const blockedAvailability = await prisma.availability.findMany({
      where: {
        date: appointmentDate,
        available: false,
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Remove blocked time slots
    blockedAvailability.forEach((blocked) => {
      const start = parseInt(blocked.startTime.split(":")[0]);
      const end = parseInt(blocked.endTime.split(":")[0]);
      for (let hour = start; hour < end; hour++) {
        const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
        availableRanges = availableRanges.filter((range) => {
          return !range.startsWith(timeSlot);
        });
      }
    });

    // Special handling for same day appointments (can't book within 2 hours)
    const now = new Date();
    const isToday = checkDate.getTime() === today.getTime();

    if (isToday) {
      const currentHour = now.getHours();
      const cutoffTime = currentHour + 2; // 2 hours notice required
      availableRanges = availableRanges.filter((range) => {
        const slotHour = parseInt(range.split(" - ")[0].split(":")[0]);
        return slotHour >= cutoffTime;
      });

      return NextResponse.json({
        date: date,
        availableRanges,
        isToday: true,
        message: "Para citas del mismo día se requiere al menos 2 horas de anticipación",
      });
    }

    return NextResponse.json({
      date: date,
      availableRanges,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
