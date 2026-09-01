import nodemailer from "nodemailer";

const EMAIL_CONFIG = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER || "marcelacordero.bookings@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD || "",
  },
  adminEmails: process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").map((email) => email.trim())
    : ["marcelacordero.bookings@gmail.com"],
};

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

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
      if (process.env.NODE_ENV !== "production") {
        console.log("Gmail credentials not configured, skipping email send");
      }
      return false;
    }
    const transporter = getTransporter();
    if (!transporter) {
      if (process.env.NODE_ENV !== "production") {
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
    console.log("Email sent successfully to:", emailData.to, "Message ID:", result.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendEmailToAdmins = async (emailData: Omit<EmailData, "to">): Promise<boolean> => {
  try {
    if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Gmail credentials not configured, skipping email send");
      }
      return false;
    }
    const transporter = getTransporter();
    if (!transporter) {
      if (process.env.NODE_ENV !== "production") {
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
      EMAIL_CONFIG.adminEmails.join(", "),
      "Message ID:",
      result.messageId,
    );
    return true;
  } catch (error) {
    console.error("Error sending email to admins:", error);
    return false;
  }
};

// ponytail: modern sans, meta color-scheme, año dinámico, preheader hidden
const generateInlineEmailStructure = (content: string, preheader?: string) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Marcela Cordero Makeup</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    :root { color-scheme: light dark; }
    @media (prefers-color-scheme: dark) {
      body { background-color: #0F0B08 !important; }
      .email-wrapper { background-color: #0F0B08 !important; }
      .email-container { background-color: #1A120E !important; border-color: #2D1F16 !important; }
      .email-header, .email-body { background-color: #1A120E !important; }
      .email-footer { background-color: #161008 !important; border-color: #2D1F16 !important; }
      .accent { background: linear-gradient(90deg, #C9A88A, #E8D5C4) !important; }
      .accent-text { color: #E8D5C4 !important; }
      .divider { background-color: #C9A88A !important; }
      .info-box { background-color: #1E1712 !important; border-left-color: #C9A88A !important; color: #E9DED3 !important; }
      .text-heading { color: #F5EDE4 !important; }
      .text-body { color: #D4C4B0 !important; }
      .text-muted { color: #9A8475 !important; }
      a.button-primary { background-color: #C9A88A !important; color: #0F0B08 !important; }
    }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; border-radius: 16px !important; }
      .email-header { padding: 28px 20px 16px !important; }
      .email-body { padding: 8px 20px 28px !important; }
      .email-footer { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; font-family: 'Plus Jakarta Sans', Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background-color: #F6EFE8; -webkit-font-smoothing: antialiased;">
  ${preheader ? `<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">${preheader}&#847; &zwnj; &nbsp; &#8199; &shy;</div>` : ""}
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="email-wrapper" style="background-color: #F6EFE8;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:24px; border:1px solid #EDE6DE; overflow:hidden; box-shadow: 0 4px 24px rgba(176,132,99,0.08);">
          <tr>
            <td class="accent" style="height:4px; background: linear-gradient(90deg, #B08463 0%, #D0B9A7 100%); line-height:4px; font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td class="email-header" style="padding: 36px 32px 18px; text-align:center; background-color:#ffffff;">
              <div style="font-size:11px; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:#9A8475; line-height:1;">MARCELA CORDERO</div>
              <div style="font-size:26px; font-weight:300; letter-spacing:-0.5px; color:#1A120E; margin:6px 0 0; line-height:1.1;">Makeup Artist</div>
              <div class="divider" style="width:40px; height:2px; background-color:#B08463; margin:16px auto 0; border-radius:999px;"></div>
            </td>
          </tr>
          <tr>
            <td class="email-body" style="padding: 8px 32px 32px; background-color:#ffffff; color:#3D2E24;">
              ${content}
            </td>
          </tr>
          <tr>
            <td class="email-footer" style="padding: 22px 32px; text-align:center; background-color:#FDFBF9; border-top:1px solid #F0E6DE;">
              <p class="text-muted" style="margin:0; font-size:13px; color:#9A8475; letter-spacing:0.2px;">© ${new Date().getFullYear()} Marcela Cordero Makeup</p>
              <p class="text-muted" style="margin:6px 0 0; font-size:12px; color:#B8A89A; line-height:1.5;">Av. Bolívar 1075, Pueblo Libre · Lima<br><a href="https://marcelacorderomakeup.com" style="color:#B08463; text-decoration:none; font-weight:500;">marcelacorderomakeup.com</a> · <a href="https://www.instagram.com/marcelacorderomakeup" style="color:#B08463; text-decoration:none;">Instagram</a></p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0; font-size:11px; color:#B8A89A; line-height:1.5;">Si no solicitaste este correo, puedes ignorarlo de forma segura.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const createEmailButton = (
  text: string,
  href?: string,
  style: "primary" | "secondary" = "primary",
) => {
  const baseStyle =
    "display:inline-block; padding:13px 28px; text-decoration:none; border-radius:999px; font-size:14px; font-weight:600; text-align:center; letter-spacing:0.2px; margin:6px; line-height:1; mso-padding-alt:13px 28px;";
  const primaryStyle = `${baseStyle} background-color:#B08463; color:#ffffff; border:1px solid #B08463;`;
  const secondaryStyle = `${baseStyle} background-color:#ffffff; color:#3D2E24; border:1px solid #EDE6DE;`;
  const buttonStyle = style === "primary" ? primaryStyle : secondaryStyle;
  const klass = style === "primary" ? "button-primary" : "";
  if (href) {
    return `<a href="${href}" class="${klass}" style="${buttonStyle}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  }
  return `<span class="${klass}" style="${buttonStyle}">${text}</span>`;
};

const createInfoBox = (content: string, type: "info" | "success" | "warning" = "info") => {
  const baseStyle = "padding:16px 18px; border-radius:14px; margin:16px 0; border:1px solid; font-size:14px; line-height:1.6;";
  const styles = {
    info: `${baseStyle} background-color:#FDFBF9; border-color:#EDE6DE; border-left:3px solid #B08463;`,
    success: `${baseStyle} background-color:#F0FDF4; border-color:#BBF7D0; border-left:3px solid #10b981;`,
    warning: `${baseStyle} background-color:#FFFBEB; border-color:#FDE68A; border-left:3px solid #F59E0B;`,
  };
  return `<div class="info-box" style="${styles[type]}">${content}</div>`;
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
  <h2 class="text-heading" style="margin:0 0 8px 0; font-size:22px; font-weight:600; text-align:center; color:#1A120E; letter-spacing:-0.3px;">¡Hola ${clientName}!</h2>
  <p class="text-muted" style="margin:0 0 20px 0; font-size:13px; text-align:center; color:#9A8475;">Tu cita está confirmada</p>
      <p class="text-body" style="font-size:15px; line-height:1.7; margin:0 0 20px 0; color:#3D2E24;">
  Me complace confirmar tu cita para <strong style="color:#B08463; font-weight:600;">${serviceType}</strong>.
      </p>

      ${createInfoBox(
        `
  <h3 style="margin:0 0 12px 0; font-size:13px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:#9A8475;">Detalles de tu cita</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding:6px 0; font-size:14px; color:#3D2E24;">
              <span style="color:#9A8475;">Servicio</span> <strong style="color:#1A120E; float:right;">${serviceType}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0; font-size:14px; color:#3D2E24; border-top:1px solid #F0E6DE;">
              <span style="color:#9A8475;">Fecha</span> <strong style="color:#1A120E; float:right;">${date}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0; font-size:14px; color:#3D2E24; border-top:1px solid #F0E6DE;">
              <span style="color:#9A8475;">Hora</span> <strong style="color:#1A120E; float:right;">${time}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0; font-size:14px; color:#3D2E24; border-top:1px solid #F0E6DE;">
              <span style="color:#9A8475;">Ubicación</span> <strong style="color:#1A120E; float:right;">${locationType === "STUDIO" ? "Studio · Bolívar 1075" : "A domicilio"}</strong>
            </td>
          </tr>
          ${
            locationType === "HOME" && district
              ? `
          <tr>
            <td style="padding:6px 0; font-size:14px; color:#3D2E24; border-top:1px solid #F0E6DE;">
              <span style="color:#9A8475;">Distrito</span> <strong style="color:#1A120E; float:right;">${district}</strong>
            </td>
          </tr>
          `
              : ""
          }
          ${
            locationType === "HOME" && address
              ? `
          <tr>
            <td style="padding:6px 0; font-size:14px; color:#3D2E24; border-top:1px solid #F0E6DE;">
              <span style="color:#9A8475;">Dirección</span> <strong style="color:#1A120E; float:right; max-width:55%; text-align:right;">${address}</strong>
            </td>
          </tr>
          `
              : ""
          }
        </table>
      `,
        "info",
      )}

      ${
        additionalNotes
          ? createInfoBox(
              `
        <p style="margin:0; font-size:13px; font-weight:600; color:#9A8475; text-transform:uppercase; letter-spacing:0.5px;">Tu mensaje</p>
        <p style="margin:8px 0 0; font-style:italic; color:#3D2E24; font-size:14px;">"${additionalNotes}"</p>
      `,
              "info",
            )
          : ""
      }

      <p class="text-body" style="font-size:14px; line-height:1.7; margin:20px 0 0; color:#3D2E24;">
        Te escribiré 24h antes para confirmar detalles finales. Si necesitas cambiar algo, respóndeme a este correo.
      </p>

      <div style="text-align:center; margin:28px 0 0;">
  <p style="font-size:15px; font-weight:600; color:#B08463; margin:0;">¡Nos vemos pronto!</p>
  <p style="font-size:13px; color:#9A8475; margin:6px 0 0; letter-spacing:0.3px;">Marcela Cordero · Makeup Artist</p>
      </div>
    `, `Cita confirmada para ${serviceType} el ${date} a las ${time}`),
    text: `
      ¡Hola ${clientName}!

      Me complace confirmar tu cita para ${serviceType}.

      Detalles de tu cita:
      - Servicio: ${serviceType}
      - Fecha: ${date}
      - Hora: ${time}
      - Ubicación: ${locationType === "STUDIO" ? "Av. Bolívar 1075, Pueblo Libre" : "A domicilio"}
      ${locationType === "HOME" && district ? `- Distrito: ${district}` : ""}
      ${locationType === "HOME" && address ? `- Dirección: ${address}` : ""}
      ${locationType === "HOME" && addressReference ? `- Referencia: ${addressReference}` : ""}

      ${additionalNotes ? `Mensaje adicional: "${additionalNotes}"` : ""}

      Te escribiré 24h antes para confirmar detalles finales.

      ¡Nos vemos pronto!
      Marcela Cordero
    `,
  }),

  appointmentCancelled: (clientName: string, serviceType: string, date: string, time: string) => ({
    subject: "Cita cancelada - Marcela Cordero Makeup",
    html: generateInlineEmailStructure(`
  <h2 class="text-heading" style="margin:0 0 20px 0; font-size:22px; font-weight:600; text-align:center; color:#1A120E;">Hola ${clientName},</h2>

      <p class="text-body" style="font-size:15px; line-height:1.7; margin:0 0 20px 0; color:#3D2E24;">
        Lamento informarte que tu cita ha sido cancelada.
      </p>

      ${createInfoBox(
        `
        <h3 style="margin:0 0 12px 0; font-size:13px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:#9A8475;">Cita cancelada</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr><td style="padding:6px 0; font-size:14px;"><span style="color:#9A8475;">Servicio</span> <strong style="color:#1A120E; float:right;">${serviceType}</strong></td></tr>
          <tr><td style="padding:6px 0; font-size:14px; border-top:1px solid #FDE68A;"><span style="color:#9A8475;">Fecha</span> <strong style="color:#1A120E; float:right;">${date}</strong></td></tr>
          <tr><td style="padding:6px 0; font-size:14px; border-top:1px solid #FDE68A;"><span style="color:#9A8475;">Hora</span> <strong style="color:#1A120E; float:right;">${time}</strong></td></tr>
        </table>
      `,
        "warning",
      )}

      <p class="text-body" style="font-size:14px; line-height:1.7; margin:20px 0 0; color:#3D2E24;">
        Si deseas reprogramar, respóndeme y encontramos nueva fecha juntas. Disculpa las molestias.
      </p>

      <div style="text-align:center; margin:28px 0 0;">
  <p style="font-size:13px; color:#9A8475; margin:0;">Marcela Cordero · Makeup Artist</p>
      </div>
    `, `Cita cancelada: ${serviceType} el ${date}`),
    text: `
      Hola ${clientName},

      Lamento informarte que tu cita ha sido cancelada.

      Cita cancelada:
      - Servicio: ${serviceType}
      - Fecha: ${date}
      - Hora: ${time}

      Si deseas reprogramar, contáctame.

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
  <h2 class="text-heading" style="margin:0 0 20px 0; font-size:20px; font-weight:600; text-align:center; color:#1A120E;">🔔 Nueva solicitud pendiente</h2>

      ${createInfoBox(
        `
  <h3 style="margin:0 0 12px 0; font-size:13px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:#9A8475;">Cliente</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr><td style="padding:5px 0; font-size:14px;"><span style="color:#9A8475;">Nombre</span> <strong style="color:#1A120E; float:right;">${clientName}</strong></td></tr>
          <tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #F0E6DE;"><span style="color:#9A8475;">Email</span> <strong style="color:#1A120E; float:right;">${clientEmail}</strong></td></tr>
          <tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #F0E6DE;"><span style="color:#9A8475;">Teléfono</span> <strong style="color:#1A120E; float:right;">${clientPhone}</strong></td></tr>
          <tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #F0E6DE;"><span style="color:#9A8475;">Servicio</span> <strong style="color:#1A120E; float:right;">${serviceType}</strong></td></tr>
          <tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #F0E6DE;"><span style="color:#9A8475;">Fecha</span> <strong style="color:#1A120E; float:right;">${date} · ${time}</strong></td></tr>
        </table>
      `,
        "info",
      )}

      ${createInfoBox(
        `
  <h3 style="margin:0 0 12px 0; font-size:13px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:#9A8475;">Servicio</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr><td style="padding:5px 0; font-size:14px;"><span style="color:#9A8475;">Ubicación</span> <strong style="color:#1A120E; float:right;">${locationType === "STUDIO" ? "Studio · Bolívar 1075" : "A domicilio"}</strong></td></tr>
          ${locationType === "HOME" && district ? `<tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #EDE6DE;"><span style="color:#9A8475;">Distrito</span> <strong style="color:#1A120E; float:right;">${district}</strong></td></tr>` : ""}
          ${locationType === "HOME" && address ? `<tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #EDE6DE;"><span style="color:#9A8475;">Dirección</span> <strong style="color:#1A120E; float:right; max-width:55%; text-align:right;">${address}</strong></td></tr>` : ""}
          ${locationType === "HOME" && addressReference ? `<tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #EDE6DE;"><span style="color:#9A8475;">Referencia</span> <strong style="color:#1A120E; float:right;">${addressReference}</strong></td></tr>` : ""}
        </table>
      `,
        "info",
      )}

      ${additionalNotes ? createInfoBox(`<p style="margin:0; font-size:13px; font-weight:600; color:#9A8475; text-transform:uppercase; letter-spacing:0.5px;">Mensaje</p><p style="margin:8px 0 0; font-style:italic; color:#3D2E24; font-size:14px;">"${additionalNotes}"</p>`, "info") : ""}

      ${createInfoBox(`<p style="margin:0; font-size:13px; color:#92400E;"><strong>Estado: PENDIENTE</strong> — El cliente ya recibió confirmación de solicitud. Confirma desde el panel admin.</p>`, "warning")}
    `, `Nueva solicitud: ${clientName} - ${serviceType} ${date}`),
    text: `
      Nueva solicitud de cita pendiente

      Cliente: ${clientName} - ${clientEmail} - ${clientPhone}
      Servicio: ${serviceType} - ${date} ${time}
      Ubicación: ${locationType === "STUDIO" ? "Studio" : "A domicilio"} ${district || ""} ${address || ""}
      ${additionalNotes ? `Mensaje: "${additionalNotes}"` : ""}

      Estado: PENDIENTE
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
  <h2 class="text-heading" style="margin:0 0 8px 0; font-size:22px; font-weight:600; text-align:center; color:#1A120E;">¡Hola ${clientName}!</h2>
  <p class="text-muted" style="margin:0 0 20px 0; font-size:13px; text-align:center; color:#9A8475;">Solicitud recibida</p>
      <p class="text-body" style="font-size:15px; line-height:1.7; margin:0 0 20px 0; color:#3D2E24;">
  Recibí tu solicitud para <strong style="color:#B08463; font-weight:600;">${serviceType}</strong>. Te confirmo en breve.
      </p>

      ${createInfoBox(
        `
        <h3 style="margin:0 0 12px 0; font-size:13px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:#9A8475;">Tu solicitud</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr><td style="padding:5px 0; font-size:14px;"><span style="color:#9A8475;">Servicio</span> <strong style="color:#1A120E; float:right;">${serviceType}</strong></td></tr>
          <tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #FDE68A;"><span style="color:#9A8475;">Fecha</span> <strong style="color:#1A120E; float:right;">${date}</strong></td></tr>
          <tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #FDE68A;"><span style="color:#9A8475;">Hora</span> <strong style="color:#1A120E; float:right;">${time}</strong></td></tr>
          <tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #FDE68A;"><span style="color:#9A8475;">Ubicación</span> <strong style="color:#1A120E; float:right;">${locationType === "STUDIO" ? "Studio" : "A domicilio"}</strong></td></tr>
          ${locationType === "HOME" && district ? `<tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #FDE68A;"><span style="color:#9A8475;">Distrito</span> <strong style="color:#1A120E; float:right;">${district}</strong></td></tr>` : ""}
          ${locationType === "HOME" && address ? `<tr><td style="padding:5px 0; font-size:14px; border-top:1px solid #FDE68A;"><span style="color:#9A8475;">Dirección</span> <strong style="color:#1A120E; float:right; max-width:55%; text-align:right;">${address}</strong></td></tr>` : ""}
        </table>
      `,
        "warning",
      )}

      ${additionalNotes ? createInfoBox(`<p style="margin:0; font-size:13px; font-weight:600; color:#9A8475; text-transform:uppercase; letter-spacing:0.5px;">Tu mensaje</p><p style="margin:8px 0 0; font-style:italic; color:#3D2E24; font-size:14px;">"${additionalNotes}"</p>`, "info") : ""}

      ${createInfoBox(`<p style="margin:0; font-size:13px; color:#065F46;"><strong style="color:#10b981;">¿Qué sigue?</strong> Te respondo en <strong>24h</strong> para confirmar disponibilidad.</p>`, "success")}

      <div style="text-align:center; margin:28px 0 0;">
  <p style="font-size:15px; font-weight:600; color:#B08463; margin:0;">¡Gracias por contactarme!</p>
  <p style="font-size:13px; color:#9A8475; margin:6px 0 0;">Marcela Cordero</p>
      </div>
    `, `Solicitud recibida: ${serviceType} ${date}`),
    text: `
      ¡Hola ${clientName}!

      Solicitud recibida para ${serviceType} - ${date} ${time}
      Ubicación: ${locationType === "STUDIO" ? "Studio" : "A domicilio"} ${district || ""} ${address || ""}
      ${additionalNotes ? `Mensaje: "${additionalNotes}"` : ""}

      Te respondo en 24h.

      Marcela Cordero
    `,
  }),

  reviewRequest: (clientName: string, serviceType: string, date: string, reviewToken: string) => ({
    subject: "¡Comparte tu experiencia! - Marcela Cordero Makeup",
    html: generateInlineEmailStructure(`
  <h2 class="text-heading" style="margin:0 0 20px 0; font-size:22px; font-weight:600; text-align:center; color:#1A120E;">¡Hola ${clientName}!</h2>
      <p class="text-body" style="font-size:15px; line-height:1.7; margin:0 0 20px 0; color:#3D2E24;">
  Espero que hayas disfrutado tu <strong style="color:#B08463;">${serviceType}</strong> del <strong>${date}</strong>.
      </p>
      <p class="text-body" style="font-size:14px; line-height:1.7; margin:0 0 24px 0; color:#3D2E24; text-align:center;">
        ¿Me regalas 2 minutos para contar tu experiencia?
      </p>
      <div style="text-align:center; margin:24px 0;">
        ${createEmailButton("⭐ Escribir mi reseña", `${process.env.NEXTAUTH_URL || "https://marcelacorderomakeup.com"}/review/${reviewToken}`, "primary")}
      </div>
      ${createInfoBox(`<p style="margin:0; font-size:13px; color:#3D2E24; text-align:center;">Tu reseña ayuda a otras clientas y me permite mejorar. Será revisada antes de publicarse.</p>`, "info")}
      <div style="text-align:center; margin:28px 0 0;">
  <p style="font-size:15px; font-weight:600; color:#B08463; margin:0;">¡Gracias por elegirme!</p>
  <p style="font-size:13px; color:#9A8475; margin:6px 0 0;">Marcela Cordero</p>
      </div>
    `, `Comparte tu experiencia: ${serviceType}`),
    text: `
      ¡Hola ${clientName}!

      Espero que hayas disfrutado tu ${serviceType} el ${date}.

      Comparte tu experiencia: ${process.env.NEXTAUTH_URL || "https://marcelacorderomakeup.com"}/review/${reviewToken}

      ¡Gracias por elegirme!
      Marcela Cordero
    `,
  }),
};
