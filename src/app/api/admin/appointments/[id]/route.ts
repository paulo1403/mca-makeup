import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { sendPushToAll } from '@/lib/push';
import { formatDateForDisplay } from "@/utils/dateUtils";

// PATCH /api/admin/appointments/[id] - Update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { status } = body;
    const { id: appointmentId } = await params;

    // Validate status
    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    // Get appointment data before update for email
    const appointmentData = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        clientName: true,
        clientEmail: true,
        serviceType: true,
        appointmentDate: true,
        status: true,
        services: true,
      },
    });

    if (!appointmentData) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 },
      );
    }

    // If marking as completed, generate review token
    let reviewToken = null;
    if (status === "COMPLETED" && appointmentData.status !== "COMPLETED") {
      // Check if review token already exists
      const existingReview = await prisma.review.findUnique({
        where: { appointmentId },
      });

      if (!existingReview) {
        reviewToken = randomUUID();
        await prisma.review.create({
          data: {
            appointmentId,
            reviewToken,
            reviewerName: "", // Will be filled by client
            reviewerEmail: "", // Will be filled by client
            rating: null, // Will be set when client submits review
          },
        });

        // Create review DB notification and send push to user/admin
        try {
          const serviceNames =
            appointmentData.services && Array.isArray(appointmentData.services)
              ? (
                  appointmentData.services as Array<{
                    name?: string;
                    serviceName?: string;
                  }>
                )
                  .map(
                    (service) =>
                      service.name || service.serviceName || "Servicio",
                  )
                  .join(", ")
              : appointmentData.serviceType || "Servicio de maquillaje";

          const title = '¡Comparte tu experiencia!';
          const message = `Por favor califica tu servicio de ${serviceNames} del ${formatDateForDisplay(appointmentData.appointmentDate)}.`;

          await prisma.notification.create({
            data: {
              type: 'REMINDER',
              title,
              message,
              link: `${process.env.NEXTAUTH_URL || ''}/review/${reviewToken}`,
              appointmentId,
              read: false,
            },
          });

          await sendPushToAll({ title, body: message, data: { link: `${process.env.NEXTAUTH_URL || ''}/review/${reviewToken}` } });
        } catch (err) {
          console.error('Error creating review notification or sending push:', err);
        }
      } else {
        reviewToken = existingReview.reviewToken;
      }
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
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
        review: {
          select: {
            reviewToken: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedAppointment,
      reviewToken: reviewToken || updatedAppointment.review?.reviewToken,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update appointment" },
      { status: 500 },
    );
  }
}
