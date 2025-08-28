import { NextResponse } from 'next/server';
import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  adminEmails: process.env.NEXT_PUBLIC_ADMIN_EMAILS ?
    process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').map(email => email.trim()) :
    ['marcelacordero.bookings@gmail.com'],
};

export async function GET() {
  try {
    console.log('=== PRUEBA DIRECTA EMAILJS ===');
    console.log('Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('Template ID:', EMAILJS_CONFIG.templateId);
    console.log('Public Key:', EMAILJS_CONFIG.publicKey ? 'Presente' : 'Ausente');
    console.log('Admin Emails:', EMAILJS_CONFIG.adminEmails);

    // Intentar inicializar EmailJS
    if (EMAILJS_CONFIG.publicKey) {
      try {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('✅ EmailJS inicializado correctamente');
      } catch (initError) {
        console.error('❌ Error inicializando EmailJS:', initError);
        return NextResponse.json({
          status: 'error',
          message: 'Error inicializando EmailJS',
          error: initError instanceof Error ? initError.message : String(initError)
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Public key no configurada'
      }, { status: 500 });
    }

    // Intentar enviar un email simple
    const testData = {
      to_email: EMAILJS_CONFIG.adminEmails[0],
      from_name: 'Sistema de Prueba',
      client_name: 'Cliente de Prueba',
      service_name: 'Prueba Técnica',
      appointment_date: new Date().toLocaleDateString('es-ES'),
      appointment_time: new Date().toLocaleTimeString('es-ES'),
      client_phone: '+1234567890',
      client_email: 'test@example.com',
      total_price: 'S/ 0',
      notes: 'Prueba técnica de EmailJS en servidor',
      subject: 'Prueba Técnica - EmailJS Server'
    };

    console.log('Enviando email de prueba...');

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      testData
    );

    console.log('✅ Email enviado exitosamente:', result);

    return NextResponse.json({
      status: 'success',
      message: 'Email enviado exitosamente',
      result,
      config: {
        serviceId: EMAILJS_CONFIG.serviceId,
        templateId: EMAILJS_CONFIG.templateId,
        publicKey: !!EMAILJS_CONFIG.publicKey,
        adminEmails: EMAILJS_CONFIG.adminEmails
      }
    });

  } catch (error) {
    console.error('❌ Error completo:', error);

    return NextResponse.json({
      status: 'error',
      message: 'Error enviando email',
      error: error instanceof Error ? error.message : String(error),
      config: {
        serviceId: EMAILJS_CONFIG.serviceId,
        templateId: EMAILJS_CONFIG.templateId,
        publicKey: !!EMAILJS_CONFIG.publicKey,
        adminEmails: EMAILJS_CONFIG.adminEmails
      }
    }, { status: 500 });
  }
}
