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

    // Service durations in minutes
    const serviceDurations: Record<string, number> = {
      "Maquillaje de Novia - Paquete Básico (S/ 480)": 150,
      "Maquillaje de Novia - Paquete Clásico (S/ 980)": 150,
      "Maquillaje Social - Estilo Natural (S/ 200)": 90,
      "Maquillaje Social - Estilo Glam (S/ 210)": 90,
      "Maquillaje para Piel Madura (S/ 230)": 90,
    };
    const selectedDuration = serviceDurations[serviceType] || 90;

    // Helper function to add/subtract minutes from time string
    function addMinutes(time: string, mins: number) {
      const [h, m] = time.split(":").map(Number);
      const date = new Date(1970, 0, 1, h, m);
      date.setMinutes(date.getMinutes() + mins);
      return date.toTimeString().slice(0, 5);
    }

    // Helper function to convert time string to minutes since midnight
    function timeToMinutes(time: string): number {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    }

    // Helper function to convert minutes since midnight to time string
    function minutesToTime(minutes: number): string {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    }

    // Generate blocked time ranges from booked appointments
    const blockedRanges: { start: number; end: number }[] = [];

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

      blockedRanges.push({
        start: timeToMinutes(bookedBlockStart),
        end: timeToMinutes(bookedBlockEnd),
      });
    }

    // Generate available time slots dynamically
    let availableRanges: string[] = [];

    // Define working hours in minutes
    let startWorkingHours: number;
    let endWorkingHours: number;

    if (locationType === "STUDIO") {
      startWorkingHours = timeToMinutes("08:00"); // 8:00 AM
      endWorkingHours = timeToMinutes("17:00"); // 5:00 PM
    } else {
      startWorkingHours = timeToMinutes("03:00"); // 3:00 AM
      endWorkingHours = timeToMinutes("20:00"); // 8:00 PM
    }

    // Generate all possible slots starting every 30 minutes
    for (
      let currentTime = startWorkingHours;
      currentTime + selectedDuration <= endWorkingHours;
      currentTime += 30
    ) {
      const slotStart = currentTime;
      const slotEnd = currentTime + selectedDuration;

      // Check if this slot conflicts with any blocked range
      let hasConflict = false;
      for (const blocked of blockedRanges) {
        // Check for overlap: if ranges overlap, this slot is not available
        if (!(slotEnd <= blocked.start || slotStart >= blocked.end)) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        const startTime = minutesToTime(slotStart);
        const endTime = minutesToTime(slotEnd);
        availableRanges.push(`${startTime} - ${endTime}`);
      }
    }

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
      const blockedStart = timeToMinutes(blocked.startTime);
      const blockedEnd = timeToMinutes(blocked.endTime);

      availableRanges = availableRanges.filter((range) => {
        const [rangeStart, rangeEnd] = range.split(" - ");
        const rangeStartMinutes = timeToMinutes(rangeStart);
        const rangeEndMinutes = timeToMinutes(rangeEnd);

        // Check for overlap with blocked time
        return (
          rangeEndMinutes <= blockedStart || rangeStartMinutes >= blockedEnd
        );
      });
    });

    // Special handling for same day appointments (can't book within 2 hours)
    const now = new Date();
    const isToday = checkDate.getTime() === today.getTime();

    if (isToday) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const cutoffMinutes = currentMinutes + 120; // 2 hours notice required

      const filteredRanges = availableRanges.filter((range) => {
        const rangeStart = range.split(" - ")[0];
        const rangeStartMinutes = timeToMinutes(rangeStart);
        return rangeStartMinutes >= cutoffMinutes;
      });

      return NextResponse.json({
        date: date,
        availableRanges: filteredRanges,
        isToday: true,
        message:
          "Para citas del mismo día se requiere al menos 2 horas de anticipación",
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
