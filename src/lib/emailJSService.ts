import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  adminEmails: process.env.NEXT_PUBLIC_ADMIN_EMAILS ?
    process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').map(email => email.trim()) :
    ['marcelacordero.bookings@gmail.com'],
};

export interface EmailData {
  to_email: string;
  client_name: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  client_phone?: string;
  client_email?: string;
  total_price?: string;
  notes?: string;
}

export class EmailJSService {
  private static instance: EmailJSService;
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): EmailJSService {
    if (!EmailJSService.instance) {
      EmailJSService.instance = new EmailJSService();
    }
    return EmailJSService.instance;
  }

  private initialize() {
    if (EMAILJS_CONFIG.publicKey) {
      emailjs.init(EMAILJS_CONFIG.publicKey);
      this.isInitialized = true;
      console.log('📧 EmailJS inicializado correctamente');
    } else {
      console.warn('⚠️ EmailJS no configurado - emails no estarán disponibles');
    }
  }

  public async sendAppointmentNotification(data: EmailData): Promise<boolean> {
    if (!this.isInitialized) {
      console.error('❌ EmailJS no está inicializado');
      return false;
    }

    try {
      // Enviar email a todos los administradores configurados
      const emailPromises = EMAILJS_CONFIG.adminEmails.map(async (adminEmail) => {
        const adminTemplateData = {
          to_email: adminEmail,
          from_name: data.client_name,
          client_name: data.client_name,
          service_name: data.service_name,
          appointment_date: data.appointment_date,
          appointment_time: data.appointment_time,
          client_phone: data.client_phone || 'No especificado',
          client_email: data.client_email || 'No especificado',
          total_price: data.total_price || 'Por confirmar',
          notes: data.notes || 'Sin notas adicionales',
          subject: `Nueva Cita: ${data.client_name} - ${data.service_name}`,
        };

        return emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          adminTemplateData
        );
      });

      const results = await Promise.allSettled(emailPromises);
      
      // Verificar si al menos un email se envió correctamente
      const successfulSends = results.filter(result => result.status === 'fulfilled');
      
      if (successfulSends.length > 0) {
        console.log(`✅ Email enviado exitosamente a ${successfulSends.length} de ${EMAILJS_CONFIG.adminEmails.length} destinatarios`);
        return true;
      } else {
        console.error('❌ Error enviando emails a todos los destinatarios');
        return false;
      }
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      return false;
    }
  }

  public async sendAppointmentConfirmation(data: EmailData): Promise<boolean> {
    if (!this.isInitialized) {
      console.error('❌ EmailJS no está inicializado');
      return false;
    }

    try {
      // Enviar confirmación al cliente
      const clientTemplateData = {
        to_email: data.client_email,
        client_name: data.client_name,
        service_name: data.service_name,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        total_price: data.total_price || 'Por confirmar',
        admin_email: EMAILJS_CONFIG.adminEmails[0], // Usar el primer email como contacto
        subject: `Confirmación de Cita - ${data.service_name}`,
      };

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        clientTemplateData
      );

      console.log('✅ Email de confirmación enviado al cliente:', result);
      return true;
    } catch (error) {
      console.error('❌ Error enviando email de confirmación:', error);
      return false;
    }
  }

  public isConfigured(): boolean {
    return this.isInitialized &&
           !!EMAILJS_CONFIG.serviceId &&
           !!EMAILJS_CONFIG.templateId &&
           !!EMAILJS_CONFIG.publicKey;
  }

  public getAdminEmails(): string[] {
    return [...EMAILJS_CONFIG.adminEmails];
  }

  public getPrimaryAdminEmail(): string {
    return EMAILJS_CONFIG.adminEmails[0] || '';
  }

  public getConfigStatus(): {
    configured: boolean;
    serviceId: boolean;
    templateId: boolean;
    publicKey: boolean;
    adminEmails: boolean;
    adminEmailsCount: number;
  } {
    return {
      configured: this.isConfigured(),
      serviceId: !!EMAILJS_CONFIG.serviceId,
      templateId: !!EMAILJS_CONFIG.templateId,
      publicKey: !!EMAILJS_CONFIG.publicKey,
      adminEmails: EMAILJS_CONFIG.adminEmails.length > 0,
      adminEmailsCount: EMAILJS_CONFIG.adminEmails.length,
    };
  }

  public async sendTestEmail(): Promise<boolean> {
    if (!this.isInitialized) {
      console.warn('📧 EmailJS no inicializado - no se puede enviar email de prueba');
      return false;
    }

    try {
      console.log('📧 Enviando email de prueba...');

      const testData: EmailData = {
        to_email: EMAILJS_CONFIG.adminEmails[0], // Usar el primer email para pruebas
        client_name: 'Sistema de Prueba',
        service_name: 'Prueba de EmailJS',
        appointment_date: new Date().toLocaleDateString('es-ES'),
        appointment_time: new Date().toLocaleTimeString('es-ES'),
        client_phone: '+1234567890',
        client_email: 'test@example.com',
        total_price: 'S/ 0',
        notes: 'Este es un email de prueba para verificar la configuración de EmailJS'
      };

      const result = await this.sendAppointmentNotification(testData);
      return result;

    } catch (error) {
      console.error('❌ Error en email de prueba:', error);
      return false;
    }
  }
}

// Función para probar la configuración
export const testEmailConfiguration = async (): Promise<boolean> => {
  const emailService = EmailJSService.getInstance();
  return emailService.sendTestEmail();
};

// Función para verificar estado de configuración
export const getEmailConfigStatus = () => {
  const emailService = EmailJSService.getInstance();
  return emailService.getConfigStatus();
};

// Exportar instancia singleton para compatibilidad con importaciones existentes
export const emailJSService = EmailJSService.getInstance();
