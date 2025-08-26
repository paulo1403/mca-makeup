import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushToAll } from '@/lib/push';
import {
  parseDateFromString,
  formatDateForDisplay,
  formatTimeRange,
  debugDate,
} from "@/utils/dateUtils";

// GET /api/admin/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");

    // Build where clause
    const where: Record<string, unknown> = {};

    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (status && validStatuses.includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: "insensitive" } },
        { clientEmail: { contains: search, mode: "insensitive" } },
        { serviceType: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get appointments with pagination
    const [rawAppointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          clientName: true,
          clientEmail: true,
          clientPhone: true,
          serviceType: true,
          services: true,
          appointmentDate: true,
          appointmentTime: true,
          duration: true,
          additionalNotes: true,
          status: true,
          address: true,
          addressReference: true,
          district: true,
          locationType: true,
          servicePrice: true,
          transportCost: true,
          totalPrice: true,
          createdAt: true,
          updatedAt: true,
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
      }),
      prisma.appointment.count({ where }),
    ]);

    // Format appointments preserving timezone info
    const appointments = rawAppointments.map((appointment) => ({
      ...appointment,
      appointmentDate: appointment.appointmentDate.toISOString(),
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        appointments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}

// POST /api/admin/appointments - Create new appointment (admin use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      appointmentDate,
      appointmentTime,
      additionalNotes,
      status = "PENDING",
    } = body;

    // Validate required fields
    if (
      !clientName ||
      !clientEmail ||
      !clientPhone ||
      !serviceType ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Parse date correctly in Peru timezone
    let parsedAppointmentDate: Date;
    try {
      parsedAppointmentDate = parseDateFromString(appointmentDate);
      debugDate(parsedAppointmentDate, "Admin creating appointment date");
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid date format" },
        { status: 400 },
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        serviceType,
        appointmentDate: parsedAppointmentDate,
        appointmentTime,
        additionalNotes,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      data: appointment,
      message: "Appointment created successfully",
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create appointment" },
      { status: 500 },
    );
  }
}

// PATCH /api/admin/appointments - Update appointment status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required" },
        { status: 400 },
      );
    }

    // Validate status
    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    // Update appointment status
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      data: appointment,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update appointment status" },
      { status: 500 },
    );
  }
}

// PUT /api/admin/appointments - Update appointment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required" },
        { status: 400 },
      );
    }

    // Get current appointment data for email notifications
    const currentAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!currentAppointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 },
      );
    }

    // Update appointment
    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
    });

    // Create DB notification and send push when status changes
    if (updateData.status && updateData.status !== currentAppointment.status) {
      const formatDate = (date: Date) => formatDateForDisplay(date);
      const formatTime = (time: string) => formatTimeRange(time);

      const title = updateData.status === 'CONFIRMED' ? 'Cita confirmada' : updateData.status === 'CANCELLED' ? 'Cita cancelada' : 'Actualización de cita';
      const message = updateData.status === 'CONFIRMED'
        ? `Tu cita para ${appointment.serviceType || 'servicio'} el ${formatDate(appointment.appointmentDate)} a las ${formatTime(appointment.appointmentTime)} ha sido confirmada.`
        : updateData.status === 'CANCELLED'
        ? `Tu cita para ${appointment.serviceType || 'servicio'} el ${formatDate(appointment.appointmentDate)} a las ${formatTime(appointment.appointmentTime)} ha sido cancelada.`
        : `El estado de tu cita ha cambiado a ${updateData.status}`;

      try {
        await prisma.notification.create({
          data: {
            type: 'APPOINTMENT',
            title,
            message,
            link: `/admin/appointments`,
            appointmentId: appointment.id,
            read: false,
          },
        });

        await sendPushToAll({ title, body: message, data: { appointmentId: appointment.id, link: '/admin/appointments' } });
      } catch (err) {
        console.error('Error creating notification or sending push:', err);
      }
    }

    return NextResponse.json({
      success: true,
      data: appointment,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update appointment" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/appointments - Delete appointment
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required" },
        { status: 400 },
      );
    }

    // Delete appointment
    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete appointment" },
      { status: 500 },
    );
  }
}
