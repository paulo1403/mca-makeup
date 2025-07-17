import { sendEmail, emailTemplates } from '../src/lib/email';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

async function testEmailService() {
  console.log('🧪 Probando servicio de email...\n');

  // Configuración de prueba
  const testClientEmail = 'tu-email-personal@gmail.com'; // Cambia por tu email personal
  const marcelaEmail = process.env.ADMIN_EMAIL || 'marcela.cordero.makeup@gmail.com';

  console.log('📧 Configuración:');
  console.log(`- Cliente: ${testClientEmail}`);
  console.log(`- Marcela: ${marcelaEmail}`);
  console.log(`- From: ${process.env.EMAIL_FROM}`);
  console.log(`- API Key configurada: ${process.env.RESEND_API_KEY ? '✅ Sí' : '❌ No'}\n`);

  if (!process.env.RESEND_API_KEY) {
    console.log('❌ No hay API key de Resend configurada');
    console.log('👉 Ve a https://resend.com/signup para obtener una API key gratuita');
    return;
  }

  try {
    // 1. Email de confirmación para el cliente
    console.log('📤 Enviando email de confirmación al cliente...');
    const clientEmailData = emailTemplates.appointmentConfirmed(
      'Paulo (Prueba)',
      'Maquillaje de Día',
      '25 de Julio, 2025',
      '2:00 PM'
    );

    const clientResult = await sendEmail({
      to: testClientEmail,
      subject: clientEmailData.subject,
      html: clientEmailData.html,
      text: clientEmailData.text,
    });

    if (clientResult) {
      console.log('✅ Email al cliente enviado exitosamente\n');
    } else {
      console.log('❌ Error enviando email al cliente\n');
    }

    // 2. Email de notificación para Marcela
    console.log('📤 Enviando notificación a Marcela...');
    const adminEmailData = emailTemplates.newAppointmentAlert(
      'Paulo (Prueba)',
      'Maquillaje de Día',
      '25 de Julio, 2025',
      '2:00 PM',
      testClientEmail,
      '+51 999 999 999'
    );

    const adminResult = await sendEmail({
      to: marcelaEmail,
      subject: adminEmailData.subject,
      html: adminEmailData.html,
      text: adminEmailData.text,
    });

    if (adminResult) {
      console.log('✅ Email a Marcela enviado exitosamente\n');
    } else {
      console.log('❌ Error enviando email a Marcela\n');
    }

    console.log('🎉 Prueba completada!');
    console.log('📬 Revisa las bandejas de entrada (incluyendo spam)');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  }
}

// Ejecutar la prueba
testEmailService().then(() => {
  console.log('\n👋 Prueba finalizada');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
});
