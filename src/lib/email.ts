import { Resend } from 'resend';

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Configurar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key not configured, skipping email send');
      return false;
    }

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    });

    if (result.error) {
      console.error('Error sending email with Resend:', result.error);
      return false;
    }

    console.log('Email sent successfully to:', emailData.to, 'ID:', result.data?.id);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Templates de email
export const emailTemplates = {
  appointmentConfirmed: (clientName: string, serviceType: string, date: string, time: string, locationType?: string, district?: string, address?: string, addressReference?: string, additionalNotes?: string) => ({
    subject: '¡Tu cita ha sido confirmada! - Marcela Cordero Makeup',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1C1C1C; margin: 0; font-size: 28px;">Marcela Cordero</h1>
            <p style="color: #D4AF37; margin: 5px 0; font-style: italic;">Makeup Artist</p>
          </div>

          <h2 style="color: #1C1C1C; margin-bottom: 20px;">¡Hola ${clientName}!</h2>

          <p style="color: #5A5A5A; font-size: 16px; line-height: 1.6;">
            Me complace confirmar tu cita para <strong>${serviceType}</strong>.
          </p>

          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
            <h3 style="color: #1C1C1C; margin: 0 0 15px 0;">Detalles de tu cita:</h3>
            <ul style="color: #5A5A5A; margin: 0; padding-left: 20px;">
              <li><strong>Servicio:</strong> ${serviceType}</li>
              <li><strong>Fecha:</strong> ${date}</li>
              <li><strong>Hora:</strong> ${time}</li>
              <li><strong>Ubicación:</strong> ${locationType === 'STUDIO' ? 'Room Studio - Pueblo Libre' : 'A domicilio'}</li>
              ${locationType === 'HOME' && district ? `<li><strong>Distrito:</strong> ${district}</li>` : ''}
              ${locationType === 'HOME' && address ? `<li><strong>Dirección:</strong> ${address}</li>` : ''}
              ${locationType === 'HOME' && addressReference ? `<li><strong>Referencia:</strong> ${addressReference}</li>` : ''}
            </ul>
          </div>

          ${additionalNotes ? `
          <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
            <h3 style="color: #1C1C1C; margin: 0 0 15px 0;">Mensaje adicional:</h3>
            <p style="color: #5A5A5A; margin: 0; font-style: italic;">"${additionalNotes}"</p>
          </div>
          ` : ''}

          <p style="color: #5A5A5A; font-size: 16px; line-height: 1.6;">
            Estoy muy emocionada de trabajar contigo. Me pondré en contacto contigo 24 horas antes
            de la cita para confirmar los detalles finales.
          </p>

          <p style="color: #5A5A5A; font-size: 16px; line-height: 1.6;">
            Si necesitas hacer algún cambio o tienes alguna pregunta, no dudes en contactarme.
          </p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #D4AF37; font-size: 18px; margin: 0;"><strong>¡Nos vemos pronto!</strong></p>
            <p style="color: #5A5A5A; margin: 10px 0;">Marcela Cordero</p>
          </div>
        </div>
      </div>
    `,
    text: `
      ¡Hola ${clientName}!

      Me complace confirmar tu cita para ${serviceType}.

      Detalles de tu cita:
      - Servicio: ${serviceType}
      - Fecha: ${date}
      - Hora: ${time}
      - Ubicación: ${locationType === 'STUDIO' ? 'Room Studio - Pueblo Libre' : 'A domicilio'}
      ${locationType === 'HOME' && district ? `- Distrito: ${district}` : ''}
      ${locationType === 'HOME' && address ? `- Dirección: ${address}` : ''}
      ${locationType === 'HOME' && addressReference ? `- Referencia: ${addressReference}` : ''}

      ${additionalNotes ? `Mensaje adicional: "${additionalNotes}"` : ''}

      Estoy muy emocionada de trabajar contigo. Me pondré en contacto contigo 24 horas antes de la cita para confirmar los detalles finales.

      Si necesitas hacer algún cambio o tienes alguna pregunta, no dudes en contactarme.

      ¡Nos vemos pronto!
      Marcela Cordero
    `,
  }),

  appointmentCancelled: (clientName: string, serviceType: string, date: string, time: string) => ({
    subject: 'Cita cancelada - Marcela Cordero Makeup',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1C1C1C; margin: 0; font-size: 28px;">Marcela Cordero</h1>
            <p style="color: #D4AF37; margin: 5px 0; font-style: italic;">Makeup Artist</p>
          </div>

          <h2 style="color: #1C1C1C; margin-bottom: 20px;">Hola ${clientName},</h2>

          <p style="color: #5A5A5A; font-size: 16px; line-height: 1.6;">
            Lamento informarte que he tenido que cancelar tu cita programada.
          </p>

          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3 style="color: #1C1C1C; margin: 0 0 15px 0;">Cita cancelada:</h3>
            <ul style="color: #5A5A5A; margin: 0; padding-left: 20px;">
              <li><strong>Servicio:</strong> ${serviceType}</li>
              <li><strong>Fecha:</strong> ${date}</li>
              <li><strong>Hora:</strong> ${time}</li>
            </ul>
          </div>

          <p style="color: #5A5A5A; font-size: 16px; line-height: 1.6;">
            Si estás interesada en reprogramar, por favor contáctame y estaré encantada
            de encontrar una nueva fecha que funcione para ambas.
          </p>

          <p style="color: #5A5A5A; font-size: 16px; line-height: 1.6;">
            Disculpa las molestias ocasionadas.
          </p>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #5A5A5A; margin: 10px 0;">Marcela Cordero</p>
          </div>
        </div>
      </div>
    `,
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
    additionalNotes?: string
  ) => ({
    subject: 'Nueva cita confirmada automáticamente - Marcela Cordero Makeup',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1C1C1C; margin-bottom: 20px;">Nueva cita confirmada automáticamente</h2>

          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
            <h3 style="color: #1C1C1C; margin: 0 0 15px 0;">Detalles del cliente:</h3>
            <ul style="color: #5A5A5A; margin: 0; padding-left: 20px;">
              <li><strong>Nombre:</strong> ${clientName}</li>
              <li><strong>Email:</strong> ${clientEmail}</li>
              <li><strong>Teléfono:</strong> ${clientPhone}</li>
              <li><strong>Servicio:</strong> ${serviceType}</li>
              <li><strong>Fecha solicitada:</strong> ${date}</li>
              <li><strong>Hora solicitada:</strong> ${time}</li>
            </ul>
          </div>

          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <h3 style="color: #1C1C1C; margin: 0 0 15px 0;">Detalles del servicio:</h3>
            <ul style="color: #5A5A5A; margin: 0; padding-left: 20px;">
              <li><strong>Ubicación:</strong> ${locationType === 'STUDIO' ? 'Room Studio - Pueblo Libre' : 'Servicio a domicilio'}</li>
              ${locationType === 'HOME' && district ? `<li><strong>Distrito:</strong> ${district}</li>` : ''}
              ${locationType === 'HOME' && address ? `<li><strong>Dirección:</strong> ${address}</li>` : ''}
              ${locationType === 'HOME' && addressReference ? `<li><strong>Referencia:</strong> ${addressReference}</li>` : ''}
            </ul>
          </div>

          ${additionalNotes ? `
            <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
              <h3 style="color: #1C1C1C; margin: 0 0 15px 0;">Mensaje adicional:</h3>
              <p style="color: #5A5A5A; margin: 0; font-style: italic;">"${additionalNotes}"</p>
            </div>
          ` : ''}

          <p style="color: #5A5A5A; font-size: 16px; line-height: 1.6;">
            <strong>Estado:</strong> Esta cita ha sido confirmada automáticamente. El cliente ya recibió su confirmación por email.
            Puedes ver los detalles completos en el panel de administración.
          </p>
        </div>
      </div>
    `,
    text: `
      Nueva cita confirmada automáticamente

      Detalles del cliente:
      - Nombre: ${clientName}
      - Email: ${clientEmail}
      - Teléfono: ${clientPhone}
      - Servicio: ${serviceType}
      - Fecha solicitada: ${date}
      - Hora solicitada: ${time}

      Detalles del servicio:
      - Ubicación: ${locationType === 'STUDIO' ? 'Room Studio - Pueblo Libre' : 'Servicio a domicilio'}
      ${locationType === 'HOME' && district ? `- Distrito: ${district}` : ''}
      ${locationType === 'HOME' && address ? `- Dirección: ${address}` : ''}
      ${locationType === 'HOME' && addressReference ? `- Referencia: ${addressReference}` : ''}

      ${additionalNotes ? `Mensaje adicional: "${additionalNotes}"` : ''}

      Estado: Esta cita ha sido confirmada automáticamente. El cliente ya recibió su confirmación por email.
      Puedes ver los detalles completos en el panel de administración.
    `,
  }),
};
