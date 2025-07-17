import { PrismaClient, ErrorType, ErrorSeverity, ErrorStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleErrorReports() {
  try {
    console.log('🔧 Creating sample error reports...');

    const sampleReports = [
      {
        reportId: 'ERR-001-MOBILE',
        userName: 'María González',
        userEmail: 'maria.gonzalez@email.com',
        errorMessage: 'TypeError: Cannot read property "map" of undefined',
        errorStack: `TypeError: Cannot read property 'map' of undefined
    at ServicesSection (http://localhost:3000/_next/static/chunks/pages/index.js:1:2345)
    at renderWithHooks (http://localhost:3000/_next/static/chunks/framework.js:1:890)`,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        url: 'http://localhost:3000/',
        timestamp: new Date('2024-01-15T10:30:00Z').toISOString(),
        userDescription: 'La página se quedó en blanco cuando intenté ver los servicios en mi iPhone. Solo aparece un mensaje de error.',
        errorType: ErrorType.UI,
        severity: ErrorSeverity.HIGH,
        status: ErrorStatus.PENDING,
        ipAddress: '192.168.1.100',
      },
      {
        reportId: 'ERR-002-BOOKING',
        userName: 'Carmen López',
        userEmail: 'carmen.lopez@email.com',
        errorMessage: 'Failed to fetch available time slots',
        errorStack: `Error: Failed to fetch available time slots
    at fetchTimeSlots (http://localhost:3000/_next/static/chunks/pages/_app.js:2:1234)
    at BookingForm (http://localhost:3000/_next/static/chunks/pages/index.js:3:567)`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
        url: 'http://localhost:3000/#reservar',
        timestamp: new Date('2024-01-15T14:15:00Z').toISOString(),
        userDescription: 'No puedo agendar una cita, cuando selecciono la fecha no me aparecen horarios disponibles.',
        errorType: ErrorType.BOOKING,
        severity: ErrorSeverity.CRITICAL,
        status: ErrorStatus.ACKNOWLEDGED,
        ipAddress: '10.0.0.50',
      },
      {
        reportId: 'ERR-003-NETWORK',
        userName: 'Ana Martín',
        userEmail: null,
        errorMessage: 'Network request failed: Connection timeout',
        errorStack: `Error: Network request failed
    at fetch (native)
    at sendContactForm (http://localhost:3000/_next/static/chunks/pages/index.js:4:890)`,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36',
        url: 'http://localhost:3000/#contacto',
        timestamp: new Date('2024-01-15T16:45:00Z').toISOString(),
        userDescription: 'Intenté enviar un mensaje por el formulario de contacto pero no se envía. Sale un error de conexión.',
        errorType: ErrorType.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        status: ErrorStatus.IN_PROGRESS,
        ipAddress: '172.16.0.25',
      },
      {
        reportId: 'ERR-004-RUNTIME',
        userName: 'Sofía Ruiz',
        userEmail: 'sofia.ruiz@email.com',
        errorMessage: 'ReferenceError: window is not defined',
        errorStack: `ReferenceError: window is not defined
    at Object.eval (http://localhost:3000/_next/static/chunks/pages/politicas-privacidad.js:1:123)
    at Module (http://localhost:3000/_next/static/chunks/framework.js:2:456)`,
        userAgent: 'Mozilla/5.0 (Android 12; Mobile; rv:108.0) Gecko/108.0 Firefox/108.0',
        url: 'http://localhost:3000/politicas-privacidad',
        timestamp: new Date('2024-01-15T18:20:00Z').toISOString(),
        userDescription: 'Al intentar leer las políticas de privacidad, la página no carga correctamente en mi teléfono Android.',
        errorType: ErrorType.RUNTIME,
        severity: ErrorSeverity.LOW,
        status: ErrorStatus.RESOLVED,
        ipAddress: '203.0.113.45',
      },
      {
        reportId: 'ERR-005-CRITICAL',
        userName: 'Isabel Torres',
        userEmail: 'isabel.torres@email.com',
        errorMessage: 'Payment processing failed: Invalid card data',
        errorStack: `Error: Payment processing failed
    at processPayment (http://localhost:3000/_next/static/chunks/pages/checkout.js:1:789)
    at PaymentForm (http://localhost:3000/_next/static/chunks/pages/checkout.js:2:123)`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0',
        url: 'http://localhost:3000/checkout',
        timestamp: new Date('2024-01-15T20:00:00Z').toISOString(),
        userDescription: 'Ya agendé mi cita pero no pude realizar el pago. Me sale error aunque mi tarjeta está bien.',
        errorType: ErrorType.OTHER,
        severity: ErrorSeverity.CRITICAL,
        status: ErrorStatus.PENDING,
        ipAddress: '198.51.100.123',
      }
    ];

    for (const report of sampleReports) {
      await prisma.errorReport.create({
        data: report,
      });
      console.log(`✅ Created error report: ${report.reportId}`);
    }

    console.log('\n🎉 Sample error reports created successfully!');
    console.log('\nYou can now view them in the admin panel at:');
    console.log('http://localhost:3000/admin/error-reports');
    
  } catch (error) {
    console.error('❌ Error creating sample reports:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleErrorReports();
