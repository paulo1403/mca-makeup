import { emailTemplates, sendEmail } from "@/lib/serverEmail";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
      ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map((email) => email.trim())
      : ["marcelacordero.bookings@gmail.com"];

    // Test 1: Email de confirmación de cita con nuevos estilos inline
    const confirmationTemplate = emailTemplates.appointmentConfirmed(
      "Ana García",
      "Maquillaje de Novia Completo",
      "15 de diciembre de 2024",
      "14:00",
      "STUDIO",
      undefined,
      undefined,
      undefined,
      "Estoy muy emocionada por mi boda. Me gustaría un look natural pero elegante.",
    );

    const confirmationResult = await sendEmail({
      to: adminEmails[0],
      subject: "[PRUEBA INLINE] " + confirmationTemplate.subject,
      html: confirmationTemplate.html,
      text: confirmationTemplate.text,
    });

    // Test 2: Email de nueva cita pendiente con estilos inline
    const adminTemplate = emailTemplates.newAppointmentAlert(
      "María López",
      "Maquillaje Social",
      "20 de diciembre de 2024",
      "16:30",
      "maria.lopez@email.com",
      "+51 987 654 321",
      "HOME",
      "Miraflores",
      "Av. Larco 123, Dpto 501",
      "Frente al parque Kennedy",
      "Es para una cena importante, me gustaría un look sofisticado.",
    );

    const adminResult = await sendEmail({
      to: adminEmails[0],
      subject: "[PRUEBA INLINE] " + adminTemplate.subject,
      html: adminTemplate.html,
      text: adminTemplate.text,
    });

    // Test 3: Email de cita cancelada
    const cancelTemplate = emailTemplates.appointmentCancelled(
      "Carmen Silva",
      "Maquillaje de Día",
      "25 de diciembre de 2024",
      "10:00",
    );

    const cancelResult = await sendEmail({
      to: adminEmails[0],
      subject: "[PRUEBA INLINE] " + cancelTemplate.subject,
      html: cancelTemplate.html,
      text: cancelTemplate.text,
    });

    // Test 4: Email de solicitud pendiente
    const pendingTemplate = emailTemplates.appointmentPending(
      "Laura Martínez",
      "Maquillaje de Noche",
      "30 de diciembre de 2024",
      "19:00",
      "HOME",
      "San Isidro",
      "Av. Conquistadores 456",
      "Cerca al Country Club",
      "Es para una celebración de año nuevo muy especial.",
    );

    const pendingResult = await sendEmail({
      to: adminEmails[0],
      subject: "[PRUEBA INLINE] " + pendingTemplate.subject,
      html: pendingTemplate.html,
      text: pendingTemplate.text,
    });

    return NextResponse.json({
      status: "success",
      message: "Emails de prueba con estilos inline enviados correctamente",
      results: {
        confirmation: confirmationResult ? "Enviado ✅" : "Falló ❌",
        admin: adminResult ? "Enviado ✅" : "Falló ❌",
        cancellation: cancelResult ? "Enviado ✅" : "Falló ❌",
        pending: pendingResult ? "Enviado ✅" : "Falló ❌",
      },
      improvements: {
        "Estructura HTML": "Usando tablas para máxima compatibilidad",
        "Estilos CSS": "Todos los estilos son inline, sin dependencia de CSS externo",
        Tipografía: "Georgia serif para elegancia profesional",
        Colores: "Paleta consistente con la marca (#B06579, #D4AF37, #1C1C1C)",
        Responsive: "Diseño adaptativo usando width percentual",
        Iconos: "Emojis Unicode compatibles con todos los clientes",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en test de plantillas inline:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error al enviar emails de prueba con estilos inline",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
