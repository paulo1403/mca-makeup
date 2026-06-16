import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailTemplates, sendEmailToAdmins } from "@/lib/serverEmail";
import { debugDate, parseDateFromString } from "@/utils/dateUtils";
import { parseAppointmentTime } from "@/utils/dateRange";

// GET /api/admin/appointments - Get all appointments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search");
    const idParam = searchParams.get("id");

    // If an id is provided, return that single appointment formatted
    if (idParam) {
      const appointment = await prisma.appointment.findUnique({
        where: { id: idParam },
        select: {
          id: true,
          clientName: true,
          clientEmail: true,
          clientPhone: true,
          clientDocument: true,
          documentType: true,
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
          nightShiftCost: true,
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
      });

      const formatted = appointment
        ? [
            {
              ...appointment,
              appointmentDate: appointment.appointmentDate.toISOString(),
              createdAt: appointment.createdAt.toISOString(),
              updatedAt: appointment.updatedAt.toISOString(),
            },
          ]
        : [];

      return NextResponse.json({
        success: true,
        data: {
          appointments: formatted,
          pagination: {
            page: 1,
            limit,
            total: formatted.length,
            pages: formatted.length > 0 ? 1 : 0,
          },
        },
      });
    }

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
          clientDocument: true,
          documentType: true,
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
          nightShiftCost: true,
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
      clientDocument,
      documentType,
      serviceType,
      appointmentDate,
      appointmentTime,
      additionalNotes,
      status = "PENDING",
      duration,
      locationType,
      address,
      addressReference,
      district,
      servicePrice,
      transportCost,
      nightShiftCost,
      totalPrice,
      services,
      totalDuration,
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
      return NextResponse.json({ success: false, message: "Invalid date format" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    const normalizedStatus = validStatuses.includes(status) ? status : "PENDING";

    const normalizedServicePrice =
      typeof servicePrice === "number" && Number.isFinite(servicePrice) ? servicePrice : null;
    const normalizedTransportCost =
      typeof transportCost === "number" && Number.isFinite(transportCost) ? transportCost : 0;
    const normalizedNightShiftCost =
      typeof nightShiftCost === "number" && Number.isFinite(nightShiftCost) ? nightShiftCost : 0;

    const calculatedTotalPrice =
      typeof totalPrice === "number" && Number.isFinite(totalPrice)
        ? totalPrice
        : (normalizedServicePrice || 0) + normalizedTransportCost + normalizedNightShiftCost;

    const normalizedDuration =
      typeof duration === "number" && Number.isFinite(duration) && duration > 0 ? duration : 120;

    // Check for schedule conflicts with existing appointments on the same date
    const newRange = parseAppointmentTime(appointmentDate, appointmentTime, normalizedDuration);

    if (!Number.isNaN(newRange.start.getTime()) && !Number.isNaN(newRange.end.getTime())) {
      const existingAppointments = await prisma.appointment.findMany({
        where: {
          appointmentDate: parsedAppointmentDate,
          status: { not: "CANCELLED" },
        },
        select: { id: true, clientName: true, appointmentTime: true, duration: true },
      });

      for (const existing of existingAppointments) {
        const existingRange = parseAppointmentTime(
          appointmentDate,
          existing.appointmentTime,
          existing.duration || 120,
        );

        if (
          !Number.isNaN(existingRange.start.getTime()) &&
          !Number.isNaN(existingRange.end.getTime()) &&
          newRange.start < existingRange.end &&
          newRange.end > existingRange.start
        ) {
          return NextResponse.json(
            {
              success: false,
              message: `Conflicto de horario: ${existing.clientName} ya tiene una cita de ${existing.appointmentTime} en esta fecha`,
            },
            { status: 409 },
          );
        }
      }
    }

    // Create appointment (supports manual/private bookings with custom pricing)
    const appointment = await prisma.appointment.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        clientDocument: clientDocument || null,
        documentType: documentType || "PE",
        serviceType,
        appointmentDate: parsedAppointmentDate,
        appointmentTime,
        additionalNotes,
        status: normalizedStatus,
        duration: normalizedDuration,
        locationType: locationType === "STUDIO" ? "STUDIO" : "HOME",
        address: address || null,
        addressReference: addressReference || null,
        district: district || null,
        servicePrice: normalizedServicePrice,
        transportCost: normalizedTransportCost,
        nightShiftCost: normalizedNightShiftCost,
        totalPrice: calculatedTotalPrice,
        services: await enrichServices(services),
        totalDuration: totalDuration || undefined,
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

async function enrichServices(services: Record<string, unknown>[]) {
  if (!services || services.length === 0) return undefined;
  const catalogIds = services
    .filter((s) => typeof s.id === "string" && !(s.id as string).startsWith("_custom_"))
    .map((s) => s.id as string);
  const dbServices = catalogIds.length > 0
    ? await prisma.service.findMany({
        where: { id: { in: catalogIds } },
        select: { id: true, name: true, price: true, duration: true },
      })
    : [];
  const map = new Map(dbServices.map((s) => [s.id, s]));
  return services.map((s) => {
    const id = s.id as string;
    const quantity = (s.quantity as number) || 1;
    if (id.startsWith("_custom_")) {
      return {
        id,
        quantity,
        name: (s._customName as string) || null,
        price: (s._customPrice as number) ?? null,
        duration: null,
        _customName: (s._customName as string) || null,
        _customPrice: (s._customPrice as number) ?? null,
      };
    }
    const found = map.get(id);
    return {
      id,
      quantity,
      name: found?.name || null,
      price: found?.price ?? null,
      duration: found?.duration ?? null,
    };
  });
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
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
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

// PUT /api/admin/appointments - Update appointment (full edit)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      clientName,
      clientEmail,
      clientPhone,
      clientDocument,
      documentType,
      serviceType,
      appointmentDate,
      appointmentTime,
      additionalNotes,
      status = "PENDING",
      duration,
      locationType,
      address,
      addressReference,
      district,
      servicePrice,
      transportCost,
      nightShiftCost,
      totalPrice,
      services,
      totalDuration,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required" },
        { status: 400 },
      );
    }

    const currentAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!currentAppointment) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 },
      );
    }

    if (!clientName || !clientEmail || !clientPhone || !serviceType || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    let parsedAppointmentDate: Date;
    try {
      parsedAppointmentDate = parseDateFromString(appointmentDate);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid date format" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    const normalizedStatus = validStatuses.includes(status) ? status : "PENDING";

    const normalizedServicePrice =
      typeof servicePrice === "number" && Number.isFinite(servicePrice) ? servicePrice : null;
    const normalizedTransportCost =
      typeof transportCost === "number" && Number.isFinite(transportCost) ? transportCost : 0;
    const normalizedNightShiftCost =
      typeof nightShiftCost === "number" && Number.isFinite(nightShiftCost) ? nightShiftCost : 0;

    const calculatedTotalPrice =
      typeof totalPrice === "number" && Number.isFinite(totalPrice)
        ? totalPrice
        : (normalizedServicePrice || 0) + normalizedTransportCost + normalizedNightShiftCost;

    const normalizedDuration =
      typeof duration === "number" && Number.isFinite(duration) && duration > 0 ? duration : 120;

    // Check schedule conflicts excluding current appointment
    const newRange = parseAppointmentTime(appointmentDate, appointmentTime, normalizedDuration);

    if (!Number.isNaN(newRange.start.getTime()) && !Number.isNaN(newRange.end.getTime())) {
      const existingAppointments = await prisma.appointment.findMany({
        where: {
          appointmentDate: parsedAppointmentDate,
          status: { not: "CANCELLED" },
          id: { not: id },
        },
        select: { id: true, clientName: true, appointmentTime: true, duration: true },
      });

      for (const existing of existingAppointments) {
        const existingRange = parseAppointmentTime(
          appointmentDate,
          existing.appointmentTime,
          existing.duration || 120,
        );

        if (
          !Number.isNaN(existingRange.start.getTime()) &&
          !Number.isNaN(existingRange.end.getTime()) &&
          newRange.start < existingRange.end &&
          newRange.end > existingRange.start
        ) {
          return NextResponse.json(
            {
              success: false,
              message: `Conflicto de horario: ${existing.clientName} ya tiene una cita de ${existing.appointmentTime} en esta fecha`,
            },
            { status: 409 },
          );
        }
      }
    }

    // Update appointment
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        clientName,
        clientEmail,
        clientPhone,
        clientDocument: clientDocument || null,
        documentType: documentType || "PE",
        serviceType,
        appointmentDate: parsedAppointmentDate,
        appointmentTime,
        additionalNotes,
        status: normalizedStatus,
        duration: normalizedDuration,
        locationType: locationType === "STUDIO" ? "STUDIO" : "HOME",
        address: address || null,
        addressReference: addressReference || null,
        district: district || null,
        servicePrice: normalizedServicePrice,
        transportCost: normalizedTransportCost,
        nightShiftCost: normalizedNightShiftCost,
        totalPrice: calculatedTotalPrice,
        services: await enrichServices(services),
        totalDuration: totalDuration || undefined,
      },
    });

    // Send push notifications only (emails disabled)
    if (normalizedStatus !== currentAppointment.status) {
      try {
        if (normalizedStatus === "CONFIRMED") {
          const confirmedTemplate = emailTemplates.appointmentConfirmed(
            appointment.clientName,
            appointment.serviceType || "Servicio",
            appointment.appointmentDate.toLocaleDateString("es-ES"),
            appointment.appointmentTime,
            appointment.locationType,
            appointment.district || undefined,
            appointment.address || undefined,
            appointment.addressReference || undefined,
            appointment.additionalNotes || "Sin notas adicionales",
          );

          await sendEmailToAdmins({
            subject: confirmedTemplate.subject,
            html: confirmedTemplate.html,
            text: confirmedTemplate.text,
          });
        } else if (normalizedStatus === "CANCELLED") {
          const cancelledTemplate = emailTemplates.appointmentCancelled(
            appointment.clientName,
            appointment.serviceType || "Servicio",
            appointment.appointmentDate.toLocaleDateString("es-ES"),
            appointment.appointmentTime,
          );

          await sendEmailToAdmins({
            subject: cancelledTemplate.subject,
            html: cancelledTemplate.html,
            text: cancelledTemplate.text,
          });
        }
      } catch (notificationError) {
        console.error("Error sending push notification:", notificationError);
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
