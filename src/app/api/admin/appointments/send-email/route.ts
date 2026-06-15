import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailTemplates, sendEmail } from "@/lib/serverEmail";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "ID de cita requerido" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: {
        clientName: true,
        clientEmail: true,
        serviceType: true,
        appointmentDate: true,
        appointmentTime: true,
        status: true,
        locationType: true,
        district: true,
        address: true,
        addressReference: true,
        additionalNotes: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ success: false, message: "Cita no encontrada" }, { status: 404 });
    }

    const dateStr = appointment.appointmentDate.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let template: { subject: string; html: string; text?: string };

    switch (appointment.status) {
      case "CONFIRMED":
      case "COMPLETED":
        template = emailTemplates.appointmentConfirmed(
          appointment.clientName,
          appointment.serviceType || "Servicio",
          dateStr,
          appointment.appointmentTime,
          appointment.locationType,
          appointment.district || undefined,
          appointment.address || undefined,
          appointment.addressReference || undefined,
          appointment.additionalNotes || undefined,
        );
        break;
      case "CANCELLED":
        template = emailTemplates.appointmentCancelled(
          appointment.clientName,
          appointment.serviceType || "Servicio",
          dateStr,
          appointment.appointmentTime,
        );
        break;
      default:
        template = emailTemplates.appointmentPending(
          appointment.clientName,
          appointment.serviceType || "Servicio",
          dateStr,
          appointment.appointmentTime,
          appointment.locationType,
          appointment.district || undefined,
          appointment.address || undefined,
          appointment.addressReference || undefined,
          appointment.additionalNotes || undefined,
        );
    }

    const sent = await sendEmail({
      to: appointment.clientEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    if (!sent) {
      return NextResponse.json(
        { success: false, message: "No se pudo enviar el email. Verifica la configuración de correo." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, message: "Email enviado correctamente" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Error al enviar el email" },
      { status: 500 },
    );
  }
}
