import { randomUUID } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailTemplates, sendEmail } from "@/lib/serverEmail";

// PATCH /api/admin/appointments/[id] - Update appointment status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { status } = body;
    const { id: appointmentId } = await params;

    // Validate status
    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    // Get appointment data before update for email
    const appointmentData = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: {
        clientName: true,
        clientEmail: true,
        serviceType: true,
        appointmentDate: true,
        appointmentTime: true,
        status: true,
        services: true,
        locationType: true,
        district: true,
        address: true,
        addressReference: true,
        additionalNotes: true,
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

        // Review request emails disabled - reviews are handled through the website
        console.log(`Review token created for ${appointmentData.clientName}: ${reviewToken}`);
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
        nightShiftCost: true,
        totalPrice: true,
        review: {
          select: {
            reviewToken: true,
          },
        },
      },
    });

    // Send email to client based on status change
    if (appointmentData.status !== status) {
      try {
        let emailTemplate = null;
        const serviceType = appointmentData.serviceType || "Servicio de maquillaje";

        switch (status) {
          case "CONFIRMED":
            emailTemplate = emailTemplates.appointmentConfirmed(
              appointmentData.clientName,
              serviceType,
              appointmentData.appointmentDate.toLocaleDateString("es-ES"),
              appointmentData.appointmentTime,
              appointmentData.locationType,
              appointmentData.district || undefined,
              appointmentData.address || undefined,
              appointmentData.addressReference || undefined,
              appointmentData.additionalNotes || undefined,
            );
            break;

          case "CANCELLED":
            emailTemplate = emailTemplates.appointmentCancelled(
              appointmentData.clientName,
              serviceType,
              appointmentData.appointmentDate.toLocaleDateString("es-ES"),
              appointmentData.appointmentTime,
            );
            break;

          case "COMPLETED":
            // Only send review email if we just created a new review token
            if (reviewToken) {
              emailTemplate = emailTemplates.reviewRequest(
                appointmentData.clientName,
                serviceType,
                appointmentData.appointmentDate.toLocaleDateString("es-ES"),
                reviewToken,
              );
            }
            break;
        }

        if (emailTemplate) {
          const emailSent = await sendEmail({
            to: appointmentData.clientEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
          });

          console.log(
            `📧 Email ${status.toLowerCase()} enviado a ${appointmentData.clientName}:`,
            emailSent ? "✅ Exitoso" : "❌ Fallido",
          );
        }
      } catch (emailError) {
        console.error("Error enviando email al cliente:", emailError);
        // No falla la operación si el email falla
      }
    }

    // Auto-create finance entries when appointment completes
    if (status === "COMPLETED" && appointmentData.status !== "COMPLETED") {
      const entries = [];

      // Income: totalPrice or servicePrice
      const income = updatedAppointment.totalPrice || updatedAppointment.servicePrice || 0;
      if (income > 0) {
        entries.push({
          entryDate: updatedAppointment.appointmentDate,
          type: "INCOME",
          amount: income,
          category: updatedAppointment.serviceType || "Servicios",
          serviceLine: "GENERAL",
          paymentMethod: "OTHER",
          source: "APPOINTMENT",
          note: `Cita: ${updatedAppointment.id} - ${updatedAppointment.clientName}`,
        });
      }

      // Expense: transport cost
      if ((updatedAppointment.transportCost || 0) > 0) {
        entries.push({
          entryDate: updatedAppointment.appointmentDate,
          type: "EXPENSE",
          amount: updatedAppointment.transportCost,
          category: "Transporte",
          serviceLine: "GENERAL",
          paymentMethod: "OTHER",
          source: "APPOINTMENT",
          note: `Cita: ${updatedAppointment.id} - Transporte`,
        });
      }

      // Expense: night shift cost
      if ((updatedAppointment.nightShiftCost || 0) > 0) {
        entries.push({
          entryDate: updatedAppointment.appointmentDate,
          type: "EXPENSE",
          amount: updatedAppointment.nightShiftCost,
          category: "Recargo nocturno",
          serviceLine: "GENERAL",
          paymentMethod: "OTHER",
          source: "APPOINTMENT",
          note: `Cita: ${updatedAppointment.id} - Recargo nocturno`,
        });
      }

      if (entries.length > 0) {
        await prisma.financeEntry.createMany({ data: entries as any });
        console.log(`📊 ${entries.length} finanza(s) creadas desde cita ${updatedAppointment.id}`);
      }
    }

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
