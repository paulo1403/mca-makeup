import { PrismaClient, NotificationType } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleNotifications() {
  try {
    console.log('🔔 Creando notificaciones de ejemplo...');

    // Crear notificaciones de ejemplo
    const notifications = [
      {
        type: 'APPOINTMENT' as NotificationType,
        title: 'Nueva cita pendiente',
        message: 'María González solicita Maquillaje de boda para el 25 de Julio de 2025 a las 10:00',
        link: '/admin/appointments',
        read: false,
      },
      {
        type: 'SYSTEM' as NotificationType,
        title: 'Sistema actualizado',
        message: 'Se ha implementado el nuevo sistema de notificaciones en base de datos',
        link: '/admin',
        read: false,
      },
      {
        type: 'REMINDER' as NotificationType,
        title: 'Recordatorio',
        message: 'Tienes 3 citas pendientes de confirmar para esta semana',
        link: '/admin/appointments',
        read: false,
      },
      {
        type: 'ALERT' as NotificationType,
        title: 'Agenda llena',
        message: 'Tu agenda para el próximo fin de semana está completa',
        link: '/admin/availability',
        read: true, // Una ya leída para mostrar la diferencia
      },
    ];

    for (const notification of notifications) {
      await prisma.notification.create({
        data: notification,
      });
    }

    console.log('✅ Notificaciones de ejemplo creadas exitosamente');
    
    // Mostrar resumen
    const count = await prisma.notification.count();
    console.log(`📊 Total de notificaciones en la base de datos: ${count}`);
    
  } catch (error) {
    console.error('❌ Error creando notificaciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleNotifications().catch(console.error);
