import nodemailer from 'nodemailer';

const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER || 'marcelacordero.bookings@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || '',
  },
  adminEmails: process.env.NEXT_PUBLIC_ADMIN_EMAILS ?
    process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').map(email => email.trim()) :
    ['marcelacordero.bookings@gmail.com'],
};

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Configurar Nodemailer
let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: EMAIL_CONFIG.auth,
    });
  }
  return transporter;
};

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Gmail credentials not configured, skipping email send");
      }
      return false;
    }

    const transporter = getTransporter();
    if (!transporter) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Email transporter not available, skipping email send");
      }
      return false;
    }

    const mailOptions = {
      from: `"Marcela Cordero Makeup" <${EMAIL_CONFIG.auth.user}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log(
      "Email sent successfully to:",
      emailData.to,
      "Message ID:",
      result.messageId,
    );
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Nueva función para enviar emails a múltiples destinatarios (admins)
export const sendEmailToAdmins = async (emailData: Omit<EmailData, 'to'>): Promise<boolean> => {
  try {
    if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Gmail credentials not configured, skipping email send");
      }
      return false;
    }

    const transporter = getTransporter();
    if (!transporter) {
      if (process.env.NODE_ENV !== 'production') {
        console.log("Email transporter not available, skipping email send");
      }
      return false;
    }

    const mailOptions = {
      from: `"Marcela Cordero Makeup" <${EMAIL_CONFIG.auth.user}>`,
      to: EMAIL_CONFIG.adminEmails,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log(
      "Email sent successfully to admins:",
      EMAIL_CONFIG.adminEmails.join(', '),
      "Message ID:",
      result.messageId,
    );
    return true;
  } catch (error) {
    console.error("Error sending email to admins:", error);
    return false;
  }
};

// Función helper para generar estructura de email con estilos inline compatibles con clientes de email
const generateInlineEmailStructure = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marcela Cordero Makeup</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #fef7f7;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fef7f7;">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 20px; box-shadow: 0 8px 32px rgba(176, 101, 121, 0.15); overflow: hidden;">
          <!-- Header Decorativo -->
          <tr>
            <td style="height: 4px; background-color: #B06579;"></td>
          </tr>
          
          <!-- Header Principal -->
          <tr>
            <td style="padding: 40px 30px 20px; text-align: center; background-color: #ffffff;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; color: #1C1C1C; font-family: Georgia, serif;">MARCELA CORDERO</h1>
              <p style="margin: 8px 0 0; font-size: 16px; font-weight: 400; font-style: italic; letter-spacing: 1px; color: #B06579;">Makeup Artist</p>
              <div style="width: 60px; height: 2px; background-color: #D4AF37; margin: 20px auto 0; border-radius: 1px;"></div>
            </td>
          </tr>
          
          <!-- Contenido Principal -->
          <tr>
            <td style="padding: 0 30px 40px; background-color: #ffffff;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 25px 30px; text-align: center; border-top: 2px solid #f0f0f0; background-color: #ffffff;">
              <p style="margin: 0; font-size: 14px; color: #8a8a8a;">© 2024 Marcela Cordero Makeup</p>
              <p style="margin: 5px 0 0; font-size: 12px; color: #aaa;">Av. Bolívar 1073, Pueblo Libre, Lima</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Función helper para crear botones compatibles con email
const createEmailButton = (text: string, href?: string, style: 'primary' | 'secondary' = 'primary') => {
  const baseStyle = "display: inline-block; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-size: 14px; font-weight: 600; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; margin: 10px 5px;";
  
  const primaryStyle = `${baseStyle} background-color: #B06579; color: #ffffff; border: none;`;
  const secondaryStyle = `${baseStyle} background-color: #f8f9fa; color: #5a5a5a; border: 1px solid #dee2e6;`;
  
  const buttonStyle = style === 'primary' ? primaryStyle : secondaryStyle;
  
  if (href) {
    return `<a href="${href}" style="${buttonStyle}">${text}</a>`;
  }
  return `<span style="${buttonStyle}">${text}</span>`;
};

// Función helper para crear cajas de información
const createInfoBox = (content: string, type: 'info' | 'success' | 'warning' = 'info') => {
  const baseStyle = "padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid;";
  
  const styles = {
    info: `${baseStyle} background-color: #fef7f7; border-left-color: #B06579;`,
    success: `${baseStyle} background-color: #f0fdf4; border-left-color: #10b981;`,
    warning: `${baseStyle} background-color: #fffbeb; border-left-color: #f59e0b;`
  };
  
  return `<div style="${styles[type]}">${content}</div>`;
};

// Templates de email usando HTML directo (sin dependencias de EmailJS)
export const emailTemplates = {
  appointmentConfirmed: (
    clientName: string,
    serviceType: string,
    date: string,
    time: string,
    locationType?: string,
    district?: string,
    address?: string,
    addressReference?: string,
    additionalNotes?: string,
  ) => ({
    subject: "¡Tu cita ha sido confirmada! - Marcela Cordero Makeup",
    html: generateInlineEmailStructure(`
      <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 400; text-align: center; color: #B06579;">¡Hola ${clientName}!</h2>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px; color: #5a5a5a;">
        Me complace confirmar tu cita para <strong style="color: #B06579;">${serviceType}</strong>.
      </p>

      ${createInfoBox(`
        <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #B06579;">💄 Detalles de tu cita:</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Servicio:</strong> ${serviceType}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Fecha:</strong> ${date}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Hora:</strong> ${time}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Ubicación:</strong> ${locationType === "STUDIO" ? "Av. Bolívar 1073, Pueblo Libre" : "A domicilio"}
            </td>
          </tr>
          ${locationType === "HOME" && district ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Distrito:</strong> ${district}
            </td>
          </tr>
          ` : ""}
          ${locationType === "HOME" && address ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Dirección:</strong> ${address}
            </td>
          </tr>
          ` : ""}
          ${locationType === "HOME" && addressReference ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Referencia:</strong> ${addressReference}
            </td>
          </tr>
          ` : ""}
        </table>
      `, 'success')}

      ${additionalNotes ? createInfoBox(`
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1C1C1C;">💬 Mensaje adicional:</h3>
        <p style="margin: 0; font-style: italic; color: #5a5a5a;">"${additionalNotes}"</p>
      `, 'info') : ""}

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px; color: #5a5a5a;">
        Estoy muy emocionada de trabajar contigo. Me pondré en contacto contigo 24 horas antes de la cita para confirmar los detalles finales.
      </p>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 30px; color: #5a5a5a;">
        Si necesitas hacer algún cambio o tienes alguna pregunta, no dudes en contactarme.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 18px; font-weight: 600; color: #B06579; margin: 0;">¡Nos vemos pronto!</p>
        <p style="font-size: 16px; font-style: italic; color: #D4AF37; margin: 10px 0 0;">Marcela Cordero</p>
      </div>
    `),
    text: `
      ¡Hola ${clientName}!

      Me complace confirmar tu cita para ${serviceType}.

      Detalles de tu cita:
      - Servicio: ${serviceType}
      - Fecha: ${date}
      - Hora: ${time}
      - Ubicación: ${locationType === "STUDIO" ? "Av. Bolívar 1073, Pueblo Libre" : "A domicilio"}
      ${locationType === "HOME" && district ? `- Distrito: ${district}` : ""}
      ${locationType === "HOME" && address ? `- Dirección: ${address}` : ""}
      ${locationType === "HOME" && addressReference ? `- Referencia: ${addressReference}` : ""}

      ${additionalNotes ? `Mensaje adicional: "${additionalNotes}"` : ""}

      Estoy muy emocionada de trabajar contigo. Me pondré en contacto contigo 24 horas antes de la cita para confirmar los detalles finales.

      Si necesitas hacer algún cambio o tienes alguna pregunta, no dudes en contactarme.

      ¡Nos vemos pronto!
      Marcela Cordero
    `,
  }),

  appointmentCancelled: (
    clientName: string,
    serviceType: string,
    date: string,
    time: string,
  ) => ({
    subject: "Cita cancelada - Marcela Cordero Makeup",
    html: generateInlineEmailStructure(`
      <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 400; text-align: center; color: #B06579;">Hola ${clientName},</h2>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px; color: #5a5a5a;">
        Lamento informarte que he tenido que cancelar tu cita programada.
      </p>

      ${createInfoBox(`
        <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #ef4444;">⚠️ Cita cancelada:</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Servicio:</strong> ${serviceType}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Fecha:</strong> ${date}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Hora:</strong> ${time}
            </td>
          </tr>
        </table>
      `, 'warning')}

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px; color: #5a5a5a;">
        Si estás interesada en reprogramar, por favor contáctame y estaré encantada de encontrar una nueva fecha que funcione para ambas.
      </p>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 30px; color: #5a5a5a;">
        Disculpa las molestias ocasionadas.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 16px; font-style: italic; color: #B06579; margin: 0;">Marcela Cordero</p>
      </div>
    `),
    text: `
      Hola ${clientName},

      Lamento informarte que he tenido que cancelar tu cita programada.

      Cita cancelada:
      - Servicio: ${serviceType}
      - Fecha: ${date}
      - Hora: ${time}

      Si estás interesada en reprogramar, por favor contáctame y estaré encantada de encontrar una nueva fecha que funcione para ambas.

      Disculpa las molestias ocasionadas.

      Marcela Cordero
    `,
  }),

  newAppointmentAlert: (
    clientName: string,
    serviceType: string,
    date: string,
    time: string,
    clientEmail: string,
    clientPhone: string,
    locationType: string,
    district?: string,
    address?: string,
    addressReference?: string,
    additionalNotes?: string,
  ) => ({
    subject: "Nueva solicitud de cita pendiente - Marcela Cordero Makeup",
    html: generateInlineEmailStructure(`
      <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 400; text-align: center; color: #B06579;">🔔 Nueva solicitud de cita pendiente</h2>

      ${createInfoBox(`
        <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #B06579;">👤 Detalles del cliente:</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Nombre:</strong> ${clientName}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Email:</strong> ${clientEmail}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Teléfono:</strong> ${clientPhone}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Servicio:</strong> ${serviceType}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Fecha solicitada:</strong> ${date}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Hora solicitada:</strong> ${time}
            </td>
          </tr>
        </table>
      `, 'info')}

      ${createInfoBox(`
        <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #B06579;">📍 Detalles del servicio:</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Ubicación:</strong> ${locationType === "STUDIO" ? "Av. Bolívar 1073, Pueblo Libre" : "Servicio a domicilio"}
            </td>
          </tr>
          ${locationType === "HOME" && district ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Distrito:</strong> ${district}
            </td>
          </tr>
          ` : ""}
          ${locationType === "HOME" && address ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Dirección:</strong> ${address}
            </td>
          </tr>
          ` : ""}
          ${locationType === "HOME" && addressReference ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Referencia:</strong> ${addressReference}
            </td>
          </tr>
          ` : ""}
        </table>
      `, 'success')}

      ${additionalNotes ? createInfoBox(`
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1C1C1C;">💬 Mensaje adicional:</h3>
        <p style="margin: 0; font-style: italic; color: #5a5a5a;">"${additionalNotes}"</p>
      `, 'info') : ""}

      ${createInfoBox(`
        <p style="margin: 0; font-size: 14px; color: #f59e0b;"><strong>Estado:</strong> Esta cita está PENDIENTE de confirmación.</p>
        <p style="margin: 10px 0 0; font-size: 14px; color: #5a5a5a;">El cliente recibió una notificación de solicitud. Puedes confirmar o modificar la cita desde el panel de administración.</p>
      `, 'warning')}
    `),
    text: `
      Nueva solicitud de cita pendiente

      Detalles del cliente:
      - Nombre: ${clientName}
      - Email: ${clientEmail}
      - Teléfono: ${clientPhone}
      - Servicio: ${serviceType}
      - Fecha solicitada: ${date}
      - Hora solicitada: ${time}

      Detalles del servicio:
      - Ubicación: ${locationType === "STUDIO" ? "Av. Bolívar 1073, Pueblo Libre" : "Servicio a domicilio"}
      ${locationType === "HOME" && district ? `- Distrito: ${district}` : ""}
      ${locationType === "HOME" && address ? `- Dirección: ${address}` : ""}
      ${locationType === "HOME" && addressReference ? `- Referencia: ${addressReference}` : ""}

      ${additionalNotes ? `Mensaje adicional: "${additionalNotes}"` : ""}

      Estado: Esta cita está PENDIENTE de confirmación. El cliente recibió una notificación de solicitud.
      Puedes confirmar o modificar la cita desde el panel de administración.
    `,
  }),

  appointmentPending: (
    clientName: string,
    serviceType: string,
    date: string,
    time: string,
    locationType?: string,
    district?: string,
    address?: string,
    addressReference?: string,
    additionalNotes?: string,
  ) => ({
    subject: "Solicitud de cita recibida - Marcela Cordero Makeup",
    html: generateInlineEmailStructure(`
      <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 400; text-align: center; color: #B06579;">¡Hola ${clientName}!</h2>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px; color: #5a5a5a;">
        He recibido tu solicitud de cita para <strong style="color: #B06579;">${serviceType}</strong>. Te contactaré pronto para confirmar la disponibilidad y finalizar los detalles.
      </p>

      ${createInfoBox(`
        <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #f59e0b;">⏳ Detalles de tu solicitud:</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Servicio:</strong> ${serviceType}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Fecha solicitada:</strong> ${date}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Hora solicitada:</strong> ${time}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Ubicación:</strong> ${locationType === "STUDIO" ? "Av. Bolívar 1073, Pueblo Libre" : "A domicilio"}
            </td>
          </tr>
          ${locationType === "HOME" && district ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Distrito:</strong> ${district}
            </td>
          </tr>
          ` : ""}
          ${locationType === "HOME" && address ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Dirección:</strong> ${address}
            </td>
          </tr>
          ` : ""}
          ${locationType === "HOME" && addressReference ? `
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              <strong style="color: #1C1C1C;">Referencia:</strong> ${addressReference}
            </td>
          </tr>
          ` : ""}
        </table>
      `, 'warning')}

      ${additionalNotes ? createInfoBox(`
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1C1C1C;">💬 Tu mensaje:</h3>
        <p style="margin: 0; font-style: italic; color: #5a5a5a;">"${additionalNotes}"</p>
      `, 'info') : ""}

      ${createInfoBox(`
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #10b981;">📞 ¿Qué sigue?</h3>
        <p style="margin: 0; font-size: 14px; color: #5a5a5a;">Me pondré en contacto contigo dentro de las próximas <strong style="color: #1C1C1C;">24 horas</strong> para confirmar la disponibilidad y coordinar los detalles finales de tu cita.</p>
      `, 'success')}

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 30px; color: #5a5a5a;">
        Si tienes alguna pregunta urgente o necesitas hacer algún cambio, no dudes en contactarme directamente.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 18px; font-weight: 600; color: #B06579; margin: 0;">¡Gracias por contactarme!</p>
        <p style="font-size: 16px; font-style: italic; color: #D4AF37; margin: 10px 0 0;">Marcela Cordero</p>
      </div>
    `),
    text: `
      ¡Hola ${clientName}!

      He recibido tu solicitud de cita para ${serviceType}. Te contactaré pronto para confirmar la disponibilidad y finalizar los detalles.

      Detalles de tu solicitud:
      - Servicio: ${serviceType}
      - Fecha solicitada: ${date}
      - Hora solicitada: ${time}
      - Ubicación: ${locationType === "STUDIO" ? "Av. Bolívar 1073, Pueblo Libre" : "A domicilio"}
      ${locationType === "HOME" && district ? `- Distrito: ${district}` : ""}
      ${locationType === "HOME" && address ? `- Dirección: ${address}` : ""}
      ${locationType === "HOME" && addressReference ? `- Referencia: ${addressReference}` : ""}

      ${additionalNotes ? `Tu mensaje: "${additionalNotes}"` : ""}

      ¿Qué sigue?
      Me pondré en contacto contigo dentro de las próximas 24 horas para confirmar la disponibilidad y coordinar los detalles finales de tu cita.

      Si tienes alguna pregunta urgente o necesitas hacer algún cambio, no dudes en contactarme directamente.

      ¡Gracias por contactarme!
      Marcela Cordero
    `,
  }),

  reviewRequest: (
    clientName: string,
    serviceType: string,
    date: string,
    reviewToken: string,
  ) => ({
    subject: "¡Comparte tu experiencia! - Marcela Cordero Makeup",
    html: generateInlineEmailStructure(`
      <h2 style="margin: 0 0 25px 0; font-size: 24px; font-weight: 400; text-align: center; color: #B06579;">¡Hola ${clientName}!</h2>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 20px; color: #5a5a5a;">
        Espero que hayas disfrutado tu experiencia con mi servicio de <strong style="color: #B06579;">${serviceType}</strong> el día <strong>${date}</strong>.
      </p>

      <p style="font-size: 16px; line-height: 1.7; margin-bottom: 30px; color: #5a5a5a;">
        Tu opinión es muy importante para mí y me ayuda a seguir mejorando mis servicios. ¿Te gustaría compartir tu experiencia?
      </p>

      <div style="text-align: center; margin: 30px 0;">
        ${createEmailButton('⭐ Escribir mi reseña', `${process.env.NEXTAUTH_URL || "https://marcelacorderomakeup.com"}/review/${reviewToken}`, 'primary')}
      </div>

      ${createInfoBox(`
        <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #1C1C1C;">¿Por qué tu reseña es importante?</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              • Me ayuda a mejorar continuamente mis servicios
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              • Ayuda a otras clientas a conocer sobre mi trabajo
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #5a5a5a;">
              • Solo toma unos minutos de tu tiempo
            </td>
          </tr>
        </table>
      `, 'info')}

      <p style="font-size: 14px; line-height: 1.6; font-style: italic; color: #8a8a8a; margin-bottom: 30px;">
        <strong>Nota:</strong> Tu reseña será revisada antes de ser publicada. Si prefieres mantenerla privada, también puedes indicarlo en el formulario.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 18px; font-weight: 600; color: #D4AF37; margin: 0;">¡Gracias por elegirme!</p>
        <p style="font-size: 16px; font-style: italic; color: #B06579; margin: 10px 0 0;">Marcela Cordero</p>
      </div>
    `),
    text: `
      ¡Hola ${clientName}!

      Espero que hayas disfrutado tu experiencia con mi servicio de ${serviceType} el día ${date}.

      Tu opinión es muy importante para mí y me ayuda a seguir mejorando mis servicios. ¿Te gustaría compartir tu experiencia?

      Puedes escribir tu reseña en el siguiente enlace:
      ${process.env.NEXTAUTH_URL || "https://marcelacorderomakeup.com"}/review/${reviewToken}

      ¿Por qué tu reseña es importante?
      - Me ayuda a mejorar continuamente mis servicios
      - Ayuda a otras clientas a conocer sobre mi trabajo
      - Solo toma unos minutos de tu tiempo

      Nota: Tu reseña será revisada antes de ser publicada. Si prefieres mantenerla privada, también puedes indicarlo en el formulario.

      ¡Gracias por elegirme!
      Marcela Cordero
    `,
  }),
};
