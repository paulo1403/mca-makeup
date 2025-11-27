import { PrismaClient } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function getCurrentTimeInPeru(): Date {
  const now = new Date();
  const peruTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Lima" }));
  return peruTime;
}

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

    let appointmentDate: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      appointmentDate = new Date(`${date}T17:00:00.000Z`);
    } else {
      appointmentDate = new Date(date);
    }

    const today = getCurrentTimeInPeru();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(appointmentDate);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate < today) {
      return NextResponse.json(
        { error: "No se pueden agendar citas en fechas pasadas" },
        { status: 400 },
      );
    }

    const dayStart = new Date(appointmentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: dayStart,
          lt: dayEnd,
        },
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

    const allServices = await prisma.service.findMany({
      where: { isActive: true },
      select: { id: true, name: true, duration: true },
    });

    let totalDuration = 0;
    const matchedServices = [];

    for (const serviceTypeOrId of serviceTypeArray) {
      let matchedService: (typeof allServices)[number] | undefined;

      matchedService = allServices.find((s) => s.id === serviceTypeOrId);

      if (!matchedService) {
        let serviceName = serviceTypeOrId;
        if (serviceTypeOrId.includes("(S/")) {
          serviceName = serviceTypeOrId.split(" (S/")[0].trim();
        }

        matchedService = allServices.find((s) => s.name === serviceName);

        if (!matchedService) {
          matchedService = allServices.find(
            (s) =>
              s.name.toLowerCase().includes(serviceName.toLowerCase()) ||
              serviceName.toLowerCase().includes(s.name.toLowerCase()),
          );
        }
      }

      if (!matchedService) {
        console.error("No service found:", {
          serviceTypeOrId,
          availableServices: allServices.map((s) => ({ id: s.id, name: s.name })),
        });
        return NextResponse.json(
          {
            error: "Tipo de servicio no encontrado o inactivo",
            details: `Servicio buscado: "${serviceTypeOrId}"`,
            originalServiceType: serviceTypeOrId,
            availableServices: allServices.map((s) => s.name),
          },
          { status: 400 },
        );
      }

      matchedServices.push(matchedService);
      totalDuration += matchedService.duration;
    }

    let selectedDuration = totalDuration;
    if (!Number.isFinite(selectedDuration) || selectedDuration <= 0) {
      console.warn("Selected duration invalid, applying fallback", {
        totalDuration,
        serviceTypeArray,
      });
      selectedDuration = 120;
    }

    function addMinutes(time: string, mins: number) {
      const [h, m] = time.split(":").map(Number);
      const date = new Date(1970, 0, 1, h, m);
      date.setMinutes(date.getMinutes() + mins);
      return date.toTimeString().slice(0, 5);
    }

    function timeToMinutes(time: string): number {
      const trimmed = (time || "").trim();

      const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|a\.\s*m\.|p\.\s*m\.)$/i);
      if (ampmMatch) {
        let hours = Number.parseInt(ampmMatch[1], 10);
        const minutes = Number.parseInt(ampmMatch[2], 10);
        const period = ampmMatch[3].toLowerCase().replace(/\s/g, "");
        const isPM = period === "pm" || period === "p.m.";
        const isAM = period === "am" || period === "a.m.";
        if (isPM && hours !== 12) hours += 12;
        if (isAM && hours === 12) hours = 0;
        return hours * 60 + minutes;
      }

      const parts = trimmed.split(":");
      const h = Number.parseInt(parts[0] || "0", 10);
      const m = Number.parseInt(parts[1] || "0", 10);
      return h * 60 + m;
    }

    function minutesToTime(minutes: number): string {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    }

    const blockedRanges: { start: number; end: number }[] = [];

    const studioAppointments = bookedAppointments.filter((apt) => apt.locationType === "STUDIO");
    const homeAppointments = bookedAppointments.filter((apt) => apt.locationType === "HOME");

    if (studioAppointments.length > 0) {
      const sortedStudio = studioAppointments.sort((a, b) => {
        const aStart = a.appointmentTime.split(" - ")[0];
        const bStart = b.appointmentTime.split(" - ")[0];
        return timeToMinutes(aStart) - timeToMinutes(bStart);
      });

      const studioGroups: (typeof sortedStudio)[] = [];
      let currentGroup = [sortedStudio[0]];

      for (let i = 1; i < sortedStudio.length; i++) {
        const prevEnd = currentGroup[currentGroup.length - 1].appointmentTime.split(" - ")[1];
        const currentStart = sortedStudio[i].appointmentTime.split(" - ")[0];

        if (timeToMinutes(currentStart) - timeToMinutes(prevEnd) <= 30) {
          currentGroup.push(sortedStudio[i]);
        } else {
          studioGroups.push(currentGroup);
          currentGroup = [sortedStudio[i]];
        }
      }
      studioGroups.push(currentGroup);

      for (const group of studioGroups) {
        const groupStart = group[0].appointmentTime.split(" - ")[0];
        const groupEnd = group[group.length - 1].appointmentTime.split(" - ")[1];

        if (locationType === "STUDIO") {
          blockedRanges.push({
            start: timeToMinutes(groupStart),
            end: timeToMinutes(groupEnd),
          });
        } else {
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

    for (const booked of homeAppointments) {
      const bookedStart = booked.appointmentTime.split(" - ")[0];
      const bookedEnd = booked.appointmentTime.split(" - ")[1];
      let bookedBlockStart = bookedStart;
      let bookedBlockEnd = bookedEnd;

      if (locationType === "STUDIO") {
        bookedBlockStart = addMinutes(bookedStart, -60);
        bookedBlockEnd = addMinutes(bookedEnd, 60);
      } else {
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

    const specialDate = await prisma.specialDate.findFirst({
      where: {
        date: appointmentDate,
      },
    });

    if (specialDate && !specialDate.isAvailable) {
      return NextResponse.json({
        date: date,
        availableRanges: [],
        message: `${specialDate.note || "Día no disponible"}`,
        isSpecialDate: true,
        specialDateNote: specialDate.note,
      });
    }

    const dayOfWeek = appointmentDate.getDay();
    let workingPeriods: { start: number; end: number }[] = [];

    if (specialDate?.isAvailable && specialDate.startTime && specialDate.endTime) {
      workingPeriods = [
        {
          start: timeToMinutes(specialDate.startTime),
          end: timeToMinutes(specialDate.endTime),
        },
      ];

      console.log("Using special date hours:", {
        date: date,
        customHours: `${specialDate.startTime} - ${specialDate.endTime}`,
        note: specialDate.note,
      });
    } else {
      const whereClause: {
        dayOfWeek: number;
        isActive: boolean;
        locationType?: "STUDIO" | "HOME";
      } = {
        dayOfWeek,
        isActive: true,
      };

      if (locationType !== "any") {
        whereClause.locationType = locationType as "STUDIO" | "HOME";
      }

      const regularAvailability = await prisma.regularAvailability.findMany({
        where: whereClause,
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

      workingPeriods = regularAvailability.map((slot) => ({
        start: timeToMinutes(slot.startTime),
        end: timeToMinutes(slot.endTime),
      }));
    }

    let availableRanges: string[] = [];

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
      specialDate: specialDate
        ? {
            date: specialDate.date,
            isAvailable: specialDate.isAvailable,
            customHours:
              specialDate.startTime && specialDate.endTime
                ? `${specialDate.startTime} - ${specialDate.endTime}`
                : null,
            note: specialDate.note,
          }
        : null,
    });

    for (const workingPeriod of workingPeriods) {
      const startWorkingHours = workingPeriod.start;
      const endWorkingHours = workingPeriod.end;

      const allTimePoints: number[] = [startWorkingHours, endWorkingHours];

      for (const blocked of blockedRanges) {
        if (blocked.start < endWorkingHours && blocked.end > startWorkingHours) {
          allTimePoints.push(
            Math.max(blocked.start, startWorkingHours),
            Math.min(blocked.end, endWorkingHours),
          );
        }
      }

      const uniqueTimePoints = [...new Set(allTimePoints)].sort((a, b) => a - b);

      for (let i = 0; i < uniqueTimePoints.length - 1; i++) {
        const gapStart = uniqueTimePoints[i];
        const gapEnd = uniqueTimePoints[i + 1];
        const gapDuration = gapEnd - gapStart;

        if (gapStart < startWorkingHours || gapEnd > endWorkingHours) {
          continue;
        }

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

        if (locationType === "STUDIO" && gapDuration >= selectedDuration) {
          let currentSlotStart = gapStart;

          while (currentSlotStart + selectedDuration <= gapEnd) {
            const slotEnd = currentSlotStart + selectedDuration;

            let hasConflict = false;
            for (const blocked of blockedRanges) {
              if (!(slotEnd <= blocked.start || currentSlotStart >= blocked.end)) {
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

            currentSlotStart = slotEnd;
          }
        } else {
          let currentTime = gapStart;

          if (locationType === "HOME") {
            const remainder = currentTime % 30;
            if (remainder !== 0) {
              currentTime = currentTime - remainder + 30;
            }
          }

          const step = Math.max(selectedDuration, 30);
          while (currentTime + selectedDuration <= gapEnd) {
            const slotStart = currentTime;
            const slotEnd = currentTime + selectedDuration;

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

            currentTime += locationType === "HOME" ? 30 : step;
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

    availableRanges = availableRanges
      .filter((r) => {
        const [s, e] = r.split(" - ");
        return s !== e;
      })
      .filter(Boolean);

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

    for (const blocked of blockedAvailability) {
      const blockedStart = timeToMinutes(blocked.startTime);
      const blockedEnd = timeToMinutes(blocked.endTime);

      availableRanges = availableRanges.filter((range) => {
        const [rangeStart, rangeEnd] = range.split(" - ");
        const rangeStartMinutes = timeToMinutes(rangeStart);
        const rangeEndMinutes = timeToMinutes(rangeEnd);

        return rangeEndMinutes <= blockedStart || rangeStartMinutes >= blockedEnd;
      });
    }

    const now = getCurrentTimeInPeru();
    const isToday = checkDate.getTime() === today.getTime();

    if (isToday) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const cutoffMinutes = currentMinutes + 120;

      console.log("Same day booking restriction:", {
        currentTime: `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`,
        currentMinutes,
        cutoffMinutes,
        cutoffTime: `${Math.floor(cutoffMinutes / 60)}:${(cutoffMinutes % 60).toString().padStart(2, "0")}`,
        timezone: "America/Lima",
      });

      const filteredRanges = availableRanges.filter((range) => {
        const rangeStart = range.split(" - ")[0];
        const rangeStartMinutes = timeToMinutes(rangeStart);
        return rangeStartMinutes >= cutoffMinutes;
      });

      return NextResponse.json({
        date: date,
        availableRanges: filteredRanges,
        isToday: true,
        message: "Para citas del mismo día se requiere al menos 2 horas de anticipación",
        isSpecialDate: !!specialDate,
        specialDateNote: specialDate?.note,
      });
    }

    return NextResponse.json({
      date: date,
      availableRanges,
      isSpecialDate: !!specialDate,
      specialDateNote: specialDate?.note,
      ...(specialDate?.isAvailable &&
        specialDate.startTime &&
        specialDate.endTime && {
          message: `Horario especial: ${specialDate.startTime} - ${specialDate.endTime}${specialDate.note ? ` (${specialDate.note})` : ""}`,
        }),
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
