import { prisma } from "@/lib/prisma";
import { formatDateForCalendar, formatTimeRange } from "@/utils/dateUtils";
import { type NextRequest, NextResponse } from "next/server";

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

    // Solo aplicar filtro de fechas si se proporcionan parámetros
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
    // Si no hay parámetros de fecha, no se aplica filtro (se muestran todas las citas)

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
        totalDuration: true,
        services: true,
        review: {
          select: {
            reviewToken: true,
            rating: true,
            reviewText: true,
            status: true,
            isPublic: true,
          },
        },
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    // Transform data for calendar component
    const calendarAppointments = appointments.map((appointment) => {
      try {
        // Calcular precio total correctamente
        const servicePrice = appointment.servicePrice || 0;
        const transportCost = appointment.transportCost || 0;
        const totalPrice =
          appointment.totalPrice !== null && appointment.totalPrice !== undefined
            ? appointment.totalPrice
            : servicePrice + transportCost;

        // Validar y formatear tiempo de manera segura
        let formattedTime = appointment.appointmentTime;
        try {
          if (appointment.appointmentTime && typeof appointment.appointmentTime === "string") {
            formattedTime = formatTimeRange(appointment.appointmentTime);
          }
        } catch (timeError) {
          console.error(`Error formatting time for appointment ${appointment.id}:`, timeError);
          // Mantener el tiempo original si hay error
          formattedTime = appointment.appointmentTime || "Horario no disponible";
        }

        return {
          id: appointment.id,
          clientName: appointment.clientName,
          clientEmail: appointment.clientEmail,
          clientPhone: appointment.clientPhone,
          date: formatDateForCalendar(appointment.appointmentDate), // YYYY-MM-DD format in Peru timezone
          time: formattedTime,
          service: appointment.serviceType,
          status: appointment.status,
          notes: appointment.additionalNotes,
          servicePrice: servicePrice,
          transportCost: transportCost,
          totalPrice: totalPrice,
          totalDuration: appointment.totalDuration || 120, // usar duración real o fallback
          services: appointment.services,
        };
      } catch (error) {
        console.error(`Error processing appointment ${appointment.id}:`, error);
        // Devolver datos mínimos en caso de error
        return {
          id: appointment.id,
          clientName: appointment.clientName || "Cliente no disponible",
          clientEmail: appointment.clientEmail || "",
          clientPhone: appointment.clientPhone || "",
          date: appointment.appointmentDate
            ? formatDateForCalendar(appointment.appointmentDate)
            : "",
          time: appointment.appointmentTime || "Horario no disponible",
          service: appointment.serviceType || "Servicio no disponible",
          status: appointment.status || "PENDING",
          notes: appointment.additionalNotes || "",
          servicePrice: appointment.servicePrice || 0,
          transportCost: appointment.transportCost || 0,
          totalPrice: appointment.totalPrice || 0,
          totalDuration: appointment.totalDuration || 120,
          services: appointment.services || [],
        };
      }
    });

    return NextResponse.json(calendarAppointments);
  } catch (error) {
    console.error("Error fetching calendar appointments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch calendar appointments" },
      { status: 500 },
    );
  }
}
