import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatDateForCalendar, formatTimeRange } from "@/utils/dateUtils";

// GET /api/admin/appointments/calendar - Get appointments for calendar view with optional date filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build date filter if provided
    const dateFilter: {
      appointmentDate?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
    if (startDate && endDate) {
      dateFilter.appointmentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      dateFilter.appointmentDate = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      dateFilter.appointmentDate = {
        lte: new Date(endDate),
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: dateFilter,
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        clientPhone: true,
        appointmentDate: true,
        appointmentTime: true,
        serviceType: true,
        status: true,
        additionalNotes: true,
        servicePrice: true,
        transportCost: true,
        totalPrice: true,
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    // Transform data for calendar component
    const calendarAppointments = appointments.map((appointment) => ({
      id: appointment.id,
      clientName: appointment.clientName,
      clientEmail: appointment.clientEmail,
      clientPhone: appointment.clientPhone,
      date: formatDateForCalendar(appointment.appointmentDate), // YYYY-MM-DD format in Peru timezone
      time: formatTimeRange(appointment.appointmentTime),
      service: appointment.serviceType,
      status: appointment.status,
      notes: appointment.additionalNotes,
      price: appointment.totalPrice || appointment.servicePrice || 0,
    }));

    return NextResponse.json(calendarAppointments);
  } catch (error) {
    console.error("Error fetching calendar appointments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch calendar appointments" },
      { status: 500 },
    );
  }
}
