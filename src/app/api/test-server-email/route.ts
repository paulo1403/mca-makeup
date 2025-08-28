import { NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/serverEmail';

export async function GET() {
  try {
    console.log('=== PRUEBA SERVIDOR EMAIL CON NODEMAILER ===');

    // Crear un email de prueba usando los templates
    const testTemplate = emailTemplates.appointmentPending(
      'Cliente de Prueba',
      'Maquillaje Social',
      '30 de agosto de 2025',
      '15:00',
      'STUDIO',
      undefined,
      undefined,
      undefined,
      'Esta es una prueba del sistema de email del servidor'
    );

    console.log('Enviando email de prueba...');

    const success = await sendEmail({
      to: 'marcelacordero.bookings@gmail.com',
      subject: testTemplate.subject,
      html: testTemplate.html,
      text: testTemplate.text,
    });

    if (success) {
      return NextResponse.json({
        status: 'success',
        message: 'Email enviado exitosamente con Nodemailer',
        template: testTemplate.subject
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Error enviando email - verificar configuración'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error completo:', error);

    return NextResponse.json({
      status: 'error',
      message: 'Error enviando email',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
