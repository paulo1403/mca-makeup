import { prisma } from '@/lib/prisma';
import webpush from 'web-push';
import { emailJSService, EmailData } from './emailJSService';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

// Configurar VAPID keys (deberían estar en variables de entorno)
const vapidKeys = {
  subject: 'mailto:admin@marcelacorderomakeup.com',
  publicKey: process.env.VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    vapidKeys.subject,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
}

export class PushNotificationService {
  /**
   * Guarda una nueva suscripción de push
   */
  static async saveSubscription(userId: string, subscription: PushSubscriptionData, userAgent?: string) {
    try {
      // Primero eliminar cualquier suscripción anterior para este usuario
      await prisma.pushSubscription.deleteMany({
        where: { userId }
      });

      // Crear nueva suscripción
      const savedSubscription = await prisma.pushSubscription.create({
        data: {
          userId,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent: userAgent || 'Unknown',
        }
      });

      return savedSubscription;
    } catch (error) {
      console.error('Error saving push subscription:', error);
      throw error;
    }
  }

  /**
   * Obtiene la suscripción activa de un usuario
   */
  static async getSubscription(userId: string) {
    try {
      const subscription = await prisma.pushSubscription.findUnique({
        where: { userId }
      });

      if (!subscription) return null;

      return {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        }
      };
    } catch (error) {
      console.error('Error getting push subscription:', error);
      return null;
    }
  }

  /**
   * Envía una notificación push a un usuario específico
   */
  static async sendNotification(userId: string, payload: NotificationPayload) {
    try {
      const subscription = await this.getSubscription(userId);

      if (!subscription) {
        console.log(`No push subscription found for user ${userId}`);
        return false;
      }

      if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
        console.log('VAPID keys not configured, skipping push notification');
        return false;
      }

      const pushPayload = JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png',
        badge: payload.badge || '/icon-192x192.png',
        data: payload.data || {},
        actions: payload.actions || [],
        timestamp: Date.now(),
      });

      await webpush.sendNotification(subscription, pushPayload);
      console.log(`Push notification sent to user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      // Si la suscripción es inválida, la eliminamos
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const webPushError = error as { statusCode: number };
        if (webPushError.statusCode === 410 || webPushError.statusCode === 400) {
          await this.removeSubscription(userId);
        }
      }
      return false;
    }
  }

  /**
   * Elimina la suscripción de un usuario
   */
  static async removeSubscription(userId: string) {
    try {
      await prisma.pushSubscription.deleteMany({
        where: { userId }
      });
      console.log(`Push subscription removed for user ${userId}`);
    } catch (error) {
      console.error('Error removing push subscription:', error);
    }
  }

  /**
   * Envía notificación de nueva cita a Marcela con respaldo por email
   */
  static async notifyNewAppointment(
    clientName: string,
    serviceType: string,
    appointmentDate: Date,
    appointmentTime: string,
    clientPhone?: string,
    clientEmail?: string,
    totalPrice?: string,
    notes?: string
  ) {
    const payload: NotificationPayload = {
      title: 'Nueva Cita Pendiente',
      body: `${clientName} solicitó ${serviceType} para el ${appointmentDate.toLocaleDateString()} a las ${appointmentTime}`,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: {
        type: 'new_appointment',
        action: 'view_appointments'
      },
      actions: [
        {
          action: 'view',
          title: 'Ver Citas',
          icon: '/icon-192x192.png'
        }
      ]
    };

    // Asumiendo que el admin user tiene ID conocido, o buscar por email
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    const pushPromise = adminUser ? this.sendNotification(adminUser.id, payload) : Promise.resolve(false);
    
    const emailData: EmailData = {
      to_email: process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',')[0] || 'marcelacordero.bookings@gmail.com',
      client_name: clientName,
      service_name: serviceType,
      appointment_date: appointmentDate.toLocaleDateString('es-ES'),
      appointment_time: appointmentTime,
      client_phone: clientPhone,
      client_email: clientEmail,
      total_price: totalPrice,
      notes: notes,
    };

    const emailPromise = emailJSService.sendAppointmentNotification(emailData);

    const [pushResult, emailResult] = await Promise.allSettled([pushPromise, emailPromise]);

    const pushNotificationSent = pushResult.status === 'fulfilled' ? pushResult.value : false;
    const emailSent = emailResult.status === 'fulfilled' ? emailResult.value : false;

    console.log('📱 Push notification result:', pushNotificationSent ? '✅ Sent' : '❌ Failed');
    console.log('📧 Email notification result:', emailSent ? '✅ Sent' : '❌ Failed');

    if (pushNotificationSent && emailSent) {
      console.log('✅ Ambas notificaciones enviadas exitosamente (push + email)');
    } else if (pushNotificationSent || emailSent) {
      console.log('⚠️ Al menos una notificación enviada exitosamente');
    } else {
      console.error('❌ Fallaron tanto push notifications como email');
    }
  }

  /**
   * Envía notificación de cita confirmada al cliente
   */
  static async notifyAppointmentConfirmed(clientEmail: string, serviceType: string, appointmentDate: Date, appointmentTime: string) {
    // Para notificaciones al cliente, necesitaríamos su userId
    // Por ahora, esto es solo para el admin - podríamos buscar el user por email
    console.log(`Appointment confirmed notification for ${clientEmail}: ${serviceType} on ${appointmentDate.toLocaleDateString()} at ${appointmentTime}`);
    // TODO: Implement client push notifications when user authentication is added
  }
}
