import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SLOT_INTERVAL = 120;

function generateTimeSlots(interval: number): string[] {
  const slots: string[] = [];
  const startHour = 8;
  const endHour = 20;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += interval) {
      const startHourStr = hour.toString().padStart(2, "0");
      const startMinStr = min.toString().padStart(2, "0");

      const endMinutes = hour * 60 + min + interval;
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;

      if (endHour > 20 || (endHour === 20 && endMin > 0)) continue;

      const endHourStr = endHour.toString().padStart(2, "0");
      const endMinStr = endMin.toString().padStart(2, "0");

      slots.push(`${startHourStr}:${startMinStr} - ${endHourStr}:${endMinStr}`);
    }
  }
  return slots;
}

function parseTimeRange(range: string): { start: number; end: number } | null {
  const parts = range.split(" - ");
  if (parts.length !== 2) return null;

  const [startH, startM] = parts[0].split(":").map(Number);
  const [endH, endM] = parts[1].split(":").map(Number);

  return {
    start: startH * 60 + startM,
    end: endH * 60 + endM,
  };
}

function isSlotAvailable(
  slot: string,
  bookedAppointments: { appointmentTime: string }[],
): boolean {
  const slotRange = parseTimeRange(slot);
  if (!slotRange) return false;

  for (const apt of bookedAppointments) {
    const aptRange = parseTimeRange(apt.appointmentTime);
    if (!aptRange) continue;

    const buffer = 60;
    const aptStartBuffered = aptRange.start - buffer;
    const aptEndBuffered = aptRange.end + buffer;

    if (slotRange.start < aptEndBuffered && slotRange.end > aptStartBuffered) {
      return false;
    }
  }
  return true;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Fecha requerida" }, { status: 400 });
    }

    let appointmentDate: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      appointmentDate = new Date(`${date}T17:00:00.000Z`);
    } else {
      appointmentDate = new Date(date);
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
      },
      orderBy: {
        appointmentTime: "asc",
      },
    });

    const allSlots = generateTimeSlots(SLOT_INTERVAL);

    const availableSlots = allSlots.filter((slot) =>
      isSlotAvailable(slot, bookedAppointments),
    );

    return NextResponse.json({ availableRanges: availableSlots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: "Error al obtener horarios disponibles" },
      { status: 500 },
    );
  }
}
