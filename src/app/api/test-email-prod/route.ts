import { NextResponse } from "next/server";
import { emailTemplates, sendEmail, sendEmailToAdmins } from "@/lib/serverEmail";

// 🔐 Middleware de seguridad para producción
const isAuthorizedForTesting = (request: Request) => {
  const testKey = process.env.EMAIL_TEST_SECRET_KEY;
  const providedKey =
    request.headers.get("x-test-key") || new URL(request.url).searchParams.get("key");

  if (!testKey || !providedKey) {
    return false;
  }

  return testKey === providedKey;
};

export async function GET(request: Request) {
  try {
    // 🛡️ Verificar autorización en producción
    if (process.env.NODE_ENV === "production" && !isAuthorizedForTesting(request)) {
      return NextResponse.json(
        {
          status: "error",
          message: "🔒 No autorizado. Se requiere clave secreta para pruebas en producción.",
          hint: "Agrega ?key=TU_CLAVE_SECRETA a la URL",
          instructions: "Configura EMAIL_TEST_SECRET_KEY en tus variables de entorno",
          examples: [
            "GET /api/test-email-prod?template=basic&key=tu_clave",
            "GET /api/test-email-prod?template=pending&email=test@email.com&key=tu_clave",
          ],
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const template = searchParams.get("template") || "basic";
    const targetEmail = searchParams.get("email");

    // 🔒 Email de destino para pruebas en producción (solo Paulo para seguridad)
    const testEmail = targetEmail || "paulollanoscol@gmail.com";

    // Admin emails para templates admin (sigue usando la configuración normal)
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
      ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map((email) => email.trim())
      : ["marcelacordero.bookings@gmail.com"];

    console.log(`🧪 [PRODUCCIÓN] Enviando email de prueba - Template: ${template} → ${testEmail}`);

    let success = false;
    let templateName = "";

    switch (template) {
      case "basic":
        // 🔹 Prueba básica de conectividad
        success = await sendEmail({
          to: testEmail,
          subject: `[PROD TEST] ✅ Prueba básica - ${new Date().toLocaleString("es-ES")}`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fef7f7;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef7f7;">
                <tr>
                  <td align="center" style="padding: 20px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden;">
                      <tr><td style="height: 4px; background-color: #B06579;"></td></tr>
                      <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                          <h1 style="margin: 0; font-size: 28px; color: #1C1C1C;">✅ Email Test - Producción</h1>
                          <p style="margin: 10px 0; color: #B06579; font-style: italic;">Marcela Cordero Makeup</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 30px 40px;">
                          <p style="color: #5a5a5a; font-size: 16px; line-height: 1.7;">
                            🎉 ¡El sistema de emails está funcionando correctamente en producción!
                          </p>
                          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; border-left: 4px solid #10b981; margin: 20px 0;">
                            <p style="margin: 0; color: #166534;"><strong>✅ Estado:</strong> Sistema operativo</p>
                            <p style="margin: 10px 0 0; color: #166534;"><strong>🕒 Timestamp:</strong> ${new Date().toISOString()}</p>
                            <p style="margin: 10px 0 0; color: #166534;"><strong>🌍 Entorno:</strong> ${process.env.NODE_ENV}</p>
                            <p style="margin: 10px 0 0; color: #166534;"><strong>📧 Destino:</strong> ${testEmail}</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          `,
          text: `Prueba básica de email en producción - ${new Date().toLocaleString("es-ES")}`,
        });
        templateName = "🔹 Prueba Básica de Conectividad";
        break;

      case "pending": {
        const pendingTemplate = emailTemplates.appointmentPending(
          "María González",
          "Maquillaje de Novia + Peinado",
          "15 de septiembre de 2025",
          "16:00",
          "HOME",
          "Miraflores",
          "Av. Larco 123, Dpto 501",
          "Entre calle A y B, edificio blanco",
          "Tengo cabello largo y quiero un peinado elegante para mi boda",
        );

        success = await sendEmail({
          to: testEmail,
          subject: `🧪 PRUEBA - ${pendingTemplate.subject}`,
          html: pendingTemplate.html,
          text: pendingTemplate.text,
        });
        templateName = "⏳ Cita Pendiente (al cliente)";
        break;
      }

      case "confirmed": {
        const confirmedTemplate = emailTemplates.appointmentConfirmed(
          "Ana García",
          "Maquillaje de Novia Completo",
          "20 de septiembre de 2025",
          "14:00",
          "STUDIO",
          undefined,
          undefined,
          undefined,
          "Estoy muy emocionada por mi boda. Quiero un look natural pero elegante.",
        );

        success = await sendEmail({
          to: testEmail,
          subject: `🧪 PRUEBA - ${confirmedTemplate.subject}`,
          html: confirmedTemplate.html,
          text: confirmedTemplate.text,
        });
        templateName = "✅ Cita Confirmada (al cliente)";
        break;
      }

      case "admin": {
        const adminTemplate = emailTemplates.newAppointmentAlert(
          "Laura Martínez",
          "Maquillaje Social + Cejas",
          "25 de septiembre de 2025",
          "18:00",
          "laura.martinez@email.com",
          "+51 987 654 321",
          "HOME",
          "San Isidro",
          "Av. Conquistadores 456",
          "Edificio Torres del Sol, piso 8",
          "Cliente solicita maquillaje y peinado para su boda. Presupuesto aproximado: S/ 350",
        );

        success = await sendEmailToAdmins({
          subject: `🧪 PRUEBA - ${adminTemplate.subject}`,
          html: adminTemplate.html,
          text: adminTemplate.text,
        });
        templateName = "🔔 Nueva Cita (alerta para admins)";
        break;
      }

      case "cancelled": {
        const cancelledTemplate = emailTemplates.appointmentCancelled(
          "Carmen Silva",
          "Maquillaje de Día",
          "30 de septiembre de 2025",
          "10:00",
        );

        success = await sendEmail({
          to: testEmail,
          subject: `🧪 PRUEBA - ${cancelledTemplate.subject}`,
          html: cancelledTemplate.html,
          text: cancelledTemplate.text,
        });
        templateName = "❌ Cita Cancelada (al cliente)";
        break;
      }

      case "all": {
        // Prueba todos los templates
        const allResults: Record<string, boolean> = {};
        const templates = ["basic", "pending", "confirmed", "admin", "cancelled"];

        for (const tmpl of templates) {
          const url = new URL(request.url);
          url.searchParams.set("template", tmpl);
          const response = await GET(new Request(url.toString(), { headers: request.headers }));
          const result = await response.json();
          allResults[tmpl] = result.success || false;
        }

        return NextResponse.json({
          success: true,
          message: "🎯 Prueba completa de todos los templates",
          results: allResults,
          environment: process.env.NODE_ENV,
          recipient: testEmail,
          timestamp: new Date().toISOString(),
        });
      }

      default:
        return NextResponse.json(
          {
            status: "error",
            message: "Template no válido",
            availableTemplates: ["basic", "pending", "confirmed", "admin", "cancelled", "all"],
            examples: [
              "?template=basic - Prueba básica de conectividad",
              "?template=pending - Email de cita pendiente",
              "?template=confirmed - Email de confirmación",
              "?template=admin - Notificación para admins",
              "?template=cancelled - Email de cancelación",
              "?template=all - Todos los templates",
            ],
          },
          { status: 400 },
        );
    }

    if (success) {
      return NextResponse.json({
        success: true,
        message: `✅ Email "${templateName}" enviado correctamente en producción`,
        template: template,
        recipient: template === "admin" ? adminEmails : testEmail,
        environment: process.env.NODE_ENV,
        config: {
          gmailConfigured: !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD,
          adminEmails: adminEmails.length,
          domain: process.env.NEXTAUTH_URL || "https://marcelacorderomakeup.com",
        },
        timestamp: new Date().toISOString(),
      });
    }
    return NextResponse.json(
      {
        success: false,
        message: `❌ Error enviando email "${templateName}"`,
        template: template,
        environment: process.env.NODE_ENV,
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("Error en prueba de email de producción:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error en la prueba de email de producción",
        error: error instanceof Error ? error.message : "Error desconocido",
        environment: process.env.NODE_ENV,
      },
      { status: 500 },
    );
  }
}
