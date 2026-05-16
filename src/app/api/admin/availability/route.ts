import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STUDIO_SLOT_INTERVAL_KEY = "studio_slot_interval_minutes";
const HOME_SLOT_INTERVAL_KEY = "home_slot_interval_minutes";
const ALLOWED_INTERVALS = [15, 30, 45, 60] as const;

// GET /api/admin/availability - Get availability settings
export async function GET() {
  try {
    const timeSlots = await prisma.regularAvailability.findMany({
      orderBy: { dayOfWeek: "asc" },
    });

    const specialDates = await prisma.specialDate.findMany({
      orderBy: { date: "asc" },
    });

    const studioIntervalSetting = await prisma.systemSettings.findUnique({
      where: { key: STUDIO_SLOT_INTERVAL_KEY },
      select: { value: true },
    });
    const homeIntervalSetting = await prisma.systemSettings.findUnique({
      where: { key: HOME_SLOT_INTERVAL_KEY },
      select: { value: true },
    });

    const parsedStudioInterval = Number.parseInt(studioIntervalSetting?.value || "30", 10);
    const parsedHomeInterval = Number.parseInt(homeIntervalSetting?.value || "30", 10);
    const studioSlotIntervalMinutes = ALLOWED_INTERVALS.includes(
      parsedStudioInterval as (typeof ALLOWED_INTERVALS)[number],
    )
      ? parsedStudioInterval
      : 30;
    const homeSlotIntervalMinutes = ALLOWED_INTERVALS.includes(
      parsedHomeInterval as (typeof ALLOWED_INTERVALS)[number],
    )
      ? parsedHomeInterval
      : 30;

    return NextResponse.json({
      success: true,
      timeSlots,
      specialDates,
      settings: {
        studioSlotIntervalMinutes,
        homeSlotIntervalMinutes,
      },
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { success: false, message: "Error al cargar la disponibilidad" },
      { status: 500 },
    );
  }
}

// POST /api/admin/availability - Create availability slot or special date
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === "settings") {
      const studioInterval = Number.parseInt(String(data.studioSlotIntervalMinutes), 10);
      const homeInterval = Number.parseInt(String(data.homeSlotIntervalMinutes), 10);

      if (!ALLOWED_INTERVALS.includes(studioInterval as (typeof ALLOWED_INTERVALS)[number])) {
        return NextResponse.json(
          {
            success: false,
            message: "El intervalo de estudio debe ser uno de: 15, 30, 45 o 60 minutos",
          },
          { status: 400 },
        );
      }

      if (!ALLOWED_INTERVALS.includes(homeInterval as (typeof ALLOWED_INTERVALS)[number])) {
        return NextResponse.json(
          {
            success: false,
            message: "El intervalo de domicilio debe ser uno de: 15, 30, 45 o 60 minutos",
          },
          { status: 400 },
        );
      }

      const studioSetting = await prisma.systemSettings.upsert({
        where: { key: STUDIO_SLOT_INTERVAL_KEY },
        update: {
          value: String(studioInterval),
          description: "Intervalo de inicio de horarios en estudio (minutos)",
        },
        create: {
          key: STUDIO_SLOT_INTERVAL_KEY,
          value: String(studioInterval),
          description: "Intervalo de inicio de horarios en estudio (minutos)",
        },
      });

      const homeSetting = await prisma.systemSettings.upsert({
        where: { key: HOME_SLOT_INTERVAL_KEY },
        update: {
          value: String(homeInterval),
          description: "Intervalo de inicio de horarios a domicilio (minutos)",
        },
        create: {
          key: HOME_SLOT_INTERVAL_KEY,
          value: String(homeInterval),
          description: "Intervalo de inicio de horarios a domicilio (minutos)",
        },
      });

      return NextResponse.json({
        success: true,
        settings: {
          studioSlotIntervalMinutes: Number.parseInt(studioSetting.value, 10),
          homeSlotIntervalMinutes: Number.parseInt(homeSetting.value, 10),
        },
      });
    }

    if (type === "timeSlot") {
      const { dayOfWeek, startTime, endTime, locationType } = data;

      // Validate required fields
      if (dayOfWeek === undefined || !startTime || !endTime || !locationType) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Día de la semana, hora de inicio, hora de fin y tipo de ubicación son requeridos",
          },
          { status: 400 },
        );
      }

      // Validate time format and logic
      if (startTime >= endTime) {
        return NextResponse.json(
          {
            success: false,
            message: "La hora de inicio debe ser anterior a la hora de fin",
          },
          { status: 400 },
        );
      }

      // Check for overlapping time slots on the same day and location type
      const overlapping = await prisma.regularAvailability.findFirst({
        where: {
          dayOfWeek,
          locationType: locationType as "STUDIO" | "HOME",
          isActive: true,
          OR: [
            {
              AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
            },
            {
              AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
            },
            {
              AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
            },
          ],
        },
      });

      if (overlapping) {
        return NextResponse.json(
          {
            success: false,
            message: "Ya existe un horario que se superpone con el que intentas agregar",
          },
          { status: 400 },
        );
      }

      // Create the time slot
      const timeSlot = await prisma.regularAvailability.create({
        data: {
          dayOfWeek,
          startTime,
          endTime,
          locationType: locationType as "STUDIO" | "HOME",
        },
      });

      return NextResponse.json({
        success: true,
        ...timeSlot,
      });
    }
    if (type === "specialDate") {
      const { date, isAvailable, customHours, note } = data;

      // Validate required fields
      if (!date) {
        return NextResponse.json(
          {
            success: false,
            message: "La fecha es requerida",
          },
          { status: 400 },
        );
      }

      // Validate custom hours if available
      if (isAvailable && customHours) {
        if (!customHours.startTime || !customHours.endTime) {
          return NextResponse.json(
            {
              success: false,
              message: "Para fechas disponibles, hora de inicio y fin son requeridas",
            },
            { status: 400 },
          );
        }

        if (customHours.startTime >= customHours.endTime) {
          return NextResponse.json(
            {
              success: false,
              message: "La hora de inicio debe ser anterior a la hora de fin",
            },
            { status: 400 },
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
    }
    return NextResponse.json(
      {
        success: false,
        message: "Tipo de solicitud no válido",
      },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error("Error creating availability:", error);

    // Handle unique constraint violations
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      const prismaError = error as { meta?: { target?: string[] } };
      if (prismaError.meta?.target?.includes("dayOfWeek")) {
        return NextResponse.json(
          {
            success: false,
            message: "Ya existe un horario para este día con esos horarios",
          },
          { status: 400 },
        );
      }
      if (prismaError.meta?.target?.includes("date")) {
        return NextResponse.json(
          {
            success: false,
            message: "Ya existe una configuración especial para esta fecha",
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Error al crear la disponibilidad" },
      { status: 500 },
    );
  }
}
