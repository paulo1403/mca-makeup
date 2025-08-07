import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const serviceTypes = searchParams.get("serviceTypes");
    const locationType = searchParams.get("locationType");

    if (!date || !serviceTypes || !locationType) {
      return NextResponse.json(
        { error: "Fecha, tipos de servicio y ubicación requeridos" },
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

    // Parse multiple service types from comma-separated string
    const serviceTypeArray = serviceTypes
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (serviceTypeArray.length === 0) {
      return NextResponse.json(
        { error: "Al menos un tipo de servicio es requerido" },
        { status: 400 },
      );
    }

    // Get all active services for matching
    const allServices = await prisma.service.findMany({
      where: { isActive: true },
      select: { name: true, duration: true },
    });

    // Match and calculate total duration for all selected services
    let totalDuration = 0;
    const matchedServices = [];

    for (const serviceType of serviceTypeArray) {
      // Extract service name from serviceType (remove price if present)
      // Example: "Maquillaje Social - Estilo Natural (S/ 200)" -> "Maquillaje Social - Estilo Natural"
      let serviceName = serviceType;
      if (serviceType.includes("(S/")) {
        serviceName = serviceType.split(" (S/")[0].trim();
      }

      // Try exact match first
      let matchedService = allServices.find((s) => s.name === serviceName);

      // If no exact match, try partial match
      if (!matchedService) {
        matchedService = allServices.find(
          (s) =>
            s.name.toLowerCase().includes(serviceName.toLowerCase()) ||
            serviceName.toLowerCase().includes(s.name.toLowerCase()),
        );
      }

      if (!matchedService) {
        console.error("No service found:", {
          serviceType,
          serviceName,
          availableServices: allServices.map((s) => s.name),
        });
        return NextResponse.json(
          {
            error: "Tipo de servicio no encontrado o inactivo",
            details: `Servicio buscado: "${serviceName}"`,
            originalServiceType: serviceType,
            availableServices: allServices.map((s) => s.name),
          },
          { status: 400 },
        );
      }

      matchedServices.push(matchedService);
      totalDuration += matchedService.duration;
    }

    const selectedDuration = totalDuration;

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

    // First, separate appointments by location type for optimized blocking
    const studioAppointments = bookedAppointments.filter(
      (apt) => apt.locationType === "STUDIO",
    );
    const homeAppointments = bookedAppointments.filter(
      (apt) => apt.locationType === "HOME",
    );

    // Handle studio appointments - group consecutive ones
    if (studioAppointments.length > 0) {
      // Sort by start time
      const sortedStudio = studioAppointments.sort((a, b) => {
        const aStart = a.appointmentTime.split(" - ")[0];
        const bStart = b.appointmentTime.split(" - ")[0];
        return timeToMinutes(aStart) - timeToMinutes(bStart);
      });

      // Group consecutive studio appointments
      const studioGroups: (typeof sortedStudio)[] = [];
      let currentGroup = [sortedStudio[0]];

      for (let i = 1; i < sortedStudio.length; i++) {
        const prevEnd =
          currentGroup[currentGroup.length - 1].appointmentTime.split(" - ")[1];
        const currentStart = sortedStudio[i].appointmentTime.split(" - ")[0];

        // If appointments are consecutive (within 30 minutes), group them
        if (timeToMinutes(currentStart) - timeToMinutes(prevEnd) <= 30) {
          currentGroup.push(sortedStudio[i]);
        } else {
          studioGroups.push(currentGroup);
          currentGroup = [sortedStudio[i]];
        }
      }
      studioGroups.push(currentGroup);

      // For each group of studio appointments, create blocking ranges
      for (const group of studioGroups) {
        const groupStart = group[0].appointmentTime.split(" - ")[0];
        const groupEnd =
          group[group.length - 1].appointmentTime.split(" - ")[1];

        if (locationType === "STUDIO") {
          // Same location: no transport time needed
          blockedRanges.push({
            start: timeToMinutes(groupStart),
            end: timeToMinutes(groupEnd),
          });
        } else {
          // Different location (requesting HOME): add transport time
          const blockedStart = addMinutes(groupStart, -60);
          const blockedEnd = addMinutes(groupEnd, 60);

          console.log("Blocking studio group:", {
            originalGroup: `${groupStart} - ${groupEnd}`,
            blockedRange: `${blockedStart} - ${blockedEnd}`,
            appointmentCount: group.length,
          });

          blockedRanges.push({
            start: timeToMinutes(blockedStart),
            end: timeToMinutes(blockedEnd),
          });
        }
      }
    }

    // Handle home appointments individually (each needs transport time)
    for (const booked of homeAppointments) {
      const bookedStart = booked.appointmentTime.split(" - ")[0];
      const bookedEnd = booked.appointmentTime.split(" - ")[1];
      let bookedBlockStart = bookedStart;
      let bookedBlockEnd = bookedEnd;

      if (locationType === "STUDIO") {
        // Different locations (HOME→STUDIO): block 1h before and after for transport
        bookedBlockStart = addMinutes(bookedStart, -60);
        bookedBlockEnd = addMinutes(bookedEnd, 60);
      } else {
        // Both home services: block 1h before and after for transport between addresses
        bookedBlockStart = addMinutes(bookedStart, -60);
        bookedBlockEnd = addMinutes(bookedEnd, 60);
      }

      console.log("Blocking home appointment:", {
        originalBooked: `${bookedStart} - ${bookedEnd}`,
        blockedRange: `${bookedBlockStart} - ${bookedBlockEnd}`,
        requestedLocation: locationType,
      });

      blockedRanges.push({
        start: timeToMinutes(bookedBlockStart),
        end: timeToMinutes(bookedBlockEnd),
      });
    }

    // Get configured working hours from database
    const dayOfWeek = appointmentDate.getDay();
    const regularAvailability = await prisma.regularAvailability.findMany({
      where: {
        dayOfWeek,
        locationType: locationType as "STUDIO" | "HOME",
        isActive: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    if (regularAvailability.length === 0) {
      return NextResponse.json({
        date: date,
        availableRanges: [],
        message: `No hay horarios configurados para ${locationType === "STUDIO" ? "estudio" : "domicilio"} en este día`,
      });
    }

    // Generate available time slots dynamically with optimized consecutive scheduling
    let availableRanges: string[] = [];

    // Define working hours in minutes using configured availability
    const workingPeriods = regularAvailability.map((slot) => ({
      start: timeToMinutes(slot.startTime),
      end: timeToMinutes(slot.endTime),
    }));

    console.log("Working hours debug:", {
      locationType,
      workingPeriods: workingPeriods.map(
        (p) => `${minutesToTime(p.start)} - ${minutesToTime(p.end)}`,
      ),
      selectedDuration,
      totalServices: matchedServices.length,
      serviceDetails: matchedServices.map((s) => ({
        name: s.name,
        duration: s.duration,
      })),
      bookedAppointments: bookedAppointments.map((b) => ({
        time: b.appointmentTime,
        service: b.serviceType,
        location: b.locationType,
      })),
    });

    // Process each working period separately
    for (const workingPeriod of workingPeriods) {
      const startWorkingHours = workingPeriod.start;
      const endWorkingHours = workingPeriod.end;

      // Create a list of all blocked time points for this period
      const allTimePoints: number[] = [startWorkingHours, endWorkingHours];

      // Add all blocked range boundaries that intersect with this working period
      blockedRanges.forEach((blocked) => {
        if (
          blocked.start < endWorkingHours &&
          blocked.end > startWorkingHours
        ) {
          allTimePoints.push(
            Math.max(blocked.start, startWorkingHours),
            Math.min(blocked.end, endWorkingHours),
          );
        }
      });

      // Sort and remove duplicates
      const uniqueTimePoints = [...new Set(allTimePoints)].sort(
        (a, b) => a - b,
      );

      // Generate optimized slots using available gaps within this working period
      for (let i = 0; i < uniqueTimePoints.length - 1; i++) {
        const gapStart = uniqueTimePoints[i];
        const gapEnd = uniqueTimePoints[i + 1];
        const gapDuration = gapEnd - gapStart;

        // Skip if this gap is outside working hours constraints
        if (gapStart < startWorkingHours || gapEnd > endWorkingHours) {
          continue;
        }

        // Check if this gap is actually available (not blocked)
        let isGapBlocked = false;
        for (const blocked of blockedRanges) {
          if (gapStart >= blocked.start && gapEnd <= blocked.end) {
            isGapBlocked = true;
            break;
          }
        }

        if (isGapBlocked) {
          continue;
        }

        // For studio appointments, prioritize consecutive slots
        if (locationType === "STUDIO" && gapDuration >= selectedDuration) {
          // Generate consecutive slots that fill the gap efficiently
          let currentSlotStart = gapStart;

          while (currentSlotStart + selectedDuration <= gapEnd) {
            const slotEnd = currentSlotStart + selectedDuration;

            // Verify this slot doesn't conflict with any blocked range
            let hasConflict = false;
            for (const blocked of blockedRanges) {
              if (
                !(slotEnd <= blocked.start || currentSlotStart >= blocked.end)
              ) {
                hasConflict = true;
                break;
              }
            }

            if (!hasConflict) {
              const startTime = minutesToTime(currentSlotStart);
              const endTime = minutesToTime(slotEnd);
              const timeSlot = `${startTime} - ${endTime}`;
              availableRanges.push(timeSlot);
            }

            // Move to next consecutive slot (no gap)
            currentSlotStart = slotEnd;
          }
        } else {
          // For home services or smaller gaps, use traditional 30-minute intervals
          let currentTime = gapStart;

          // Align to 30-minute boundaries for home services
          if (locationType === "HOME") {
            const remainder = currentTime % 30;
            if (remainder !== 0) {
              currentTime = currentTime - remainder + 30;
            }
          }

          while (currentTime + selectedDuration <= gapEnd) {
            const slotStart = currentTime;
            const slotEnd = currentTime + selectedDuration;

            // Check if this slot conflicts with any blocked range
            let hasConflict = false;
            for (const blocked of blockedRanges) {
              if (!(slotEnd <= blocked.start || slotStart >= blocked.end)) {
                hasConflict = true;
                break;
              }
            }

            if (!hasConflict) {
              const startTime = minutesToTime(slotStart);
              const endTime = minutesToTime(slotEnd);
              const timeSlot = `${startTime} - ${endTime}`;
              availableRanges.push(timeSlot);
            }

            // For home services, increment by 30 minutes for flexibility
            currentTime += locationType === "HOME" ? 30 : selectedDuration;
          }
        }
      }
    }

    console.log("Optimized scheduling algorithm:", {
      location: locationType,
      duration: selectedDuration,
      totalServices: matchedServices.length,
      workingPeriods: workingPeriods.length,
      blockedRanges: blockedRanges.length,
    });

    // Remove duplicates and sort
    availableRanges = [...new Set(availableRanges)].sort((a, b) => {
      const aStart = timeToMinutes(a.split(" - ")[0]);
      const bStart = timeToMinutes(b.split(" - ")[0]);
      return aStart - bStart;
    });

    console.log("Generated available slots:", {
      total: availableRanges.length,
      first: availableRanges.slice(0, 3),
      location: locationType,
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
