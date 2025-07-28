import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sendEmail, emailTemplates } from '@/lib/email';

const prisma = new PrismaClient();

// Validation schema
const appointmentSchema = z.object({
  clientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string()
    .min(8, 'Teléfono inválido')
    .max(20, 'Teléfono muy largo')
    .refine((phone) => {
      // Remover espacios, guiones y símbolos para validar solo números
      const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
      // Aceptar teléfonos peruanos: 9 dígitos o con código de país (11-12 dígitos)
      return cleanPhone.length >= 9 && cleanPhone.length <= 12 && /^\d+$/.test(cleanPhone);
    }, 'Formato de teléfono inválido. Ej: +51 999 209 880 o 999209880'),
  serviceType: z.string().min(1, 'Tipo de servicio requerido'),
  appointmentDate: z.string().min(1, 'Fecha requerida'),
  appointmentTimeRange: z.string().min(1, 'Horario requerido'),
  locationType: z.enum(['STUDIO', 'HOME'], { 
    errorMap: () => ({ message: 'Selecciona una ubicación válida' }) 
  }),
  district: z.string().optional(),
  address: z.string().optional(),
  addressReference: z.string().optional(),
  additionalNotes: z.string().optional(),
}).refine((data) => {
  // Si es a domicilio, distrito y dirección son requeridos
  if (data.locationType === 'HOME') {
    return data.district && data.district.length > 0 && data.address && data.address.length > 0;
  }
  return true;
}, {
  message: "Para servicios a domicilio, distrito y dirección son requeridos",
  path: ["address"]
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = appointmentSchema.parse(body);


    // Parse date as local (Lima) date, not UTC
    let appointmentDateTime: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(validatedData.appointmentDate)) {
      const [year, month, day] = validatedData.appointmentDate.split('-').map(Number);
      appointmentDateTime = new Date(year, month - 1, day, 0, 0, 0, 0);
    } else {
      appointmentDateTime = new Date(validatedData.appointmentDate);
    }

    // Check if the appointment slot (rango) is available
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        appointmentDate: appointmentDateTime,
        appointmentTime: validatedData.appointmentTimeRange,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Este horario ya está ocupado. Por favor selecciona otro.' },
        { status: 400 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        clientPhone: validatedData.clientPhone,
        serviceType: validatedData.serviceType,
        appointmentDate: appointmentDateTime,
        appointmentTime: validatedData.appointmentTimeRange,
        additionalNotes: `Ubicación: ${validatedData.locationType === 'STUDIO' ? 'Local en Pueblo Libre' : `Domicilio - ${validatedData.district || ''}, ${validatedData.address || ''}`}${validatedData.addressReference ? ` (Ref: ${validatedData.addressReference})` : ''}${validatedData.additionalNotes ? `\n\nNotas adicionales: ${validatedData.additionalNotes}` : ''}`,
        status: 'PENDING',
      },
    });

    // Create notification for the admin
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const formatTime = (time: string) => {
      // Si es un rango, mostrar el rango tal cual
      return time;
    };

    await prisma.notification.create({
      data: {
        type: 'APPOINTMENT',
        title: 'Nueva cita pendiente',
        message: `${appointment.clientName} solicita ${appointment.serviceType} para el ${formatDate(appointment.appointmentDate)} a las ${formatTime(appointment.appointmentTime)}`,
        link: '/admin/appointments',
        appointmentId: appointment.id,
        read: false,
      },
    });

    // Send notification emails
    try {

      // Send notification to admin/Marcela
      if (process.env.ADMIN_EMAIL) {
        const adminEmailData = emailTemplates.newAppointmentAlert(
          appointment.clientName,
          appointment.serviceType,
          formatDate(appointment.appointmentDate),
          formatTime(appointment.appointmentTime),
          appointment.clientEmail,
          appointment.clientPhone,
          validatedData.locationType,
          validatedData.district,
          validatedData.address,
          validatedData.addressReference,
          validatedData.additionalNotes
        );

        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: adminEmailData.subject,
          html: adminEmailData.html,
          text: adminEmailData.text,
        });
      }

      // Send confirmation to client
      // Note: Solo enviamos confirmación cuando el admin confirme la cita
      console.log('Email notifications sent successfully');
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError);
      // No fallar la operación si el email falla
    }

    return NextResponse.json(
      {
        message: 'Cita solicitada exitosamente',
        appointmentId: appointment.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating appointment:', error);

    if (error instanceof z.ZodError) {
      // Encontrar el primer error de teléfono para dar un mensaje más específico
      const phoneError = error.errors.find(err => err.path.includes('clientPhone'));
      
      if (phoneError) {
        return NextResponse.json(
          { 
            error: 'Formato de teléfono inválido', 
            message: 'Por favor ingresa un número de teléfono válido. Ejemplos: +51 999 209 880 o 999 209 880',
            details: error.errors 
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Datos inválidos', 
          message: 'Por favor verifica que todos los campos estén completos y sean válidos.',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 });
    }

    const appointmentDate = new Date(date);

    // Get all appointments for the date
    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: appointmentDate,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      select: {
        appointmentTime: true,
      },
    });

    // Define available time ranges (rango de 1 hora)
    const allTimeRanges = [
      '09:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '12:00 - 13:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00',
      '17:00 - 18:00',
      '18:00 - 19:00',
      '19:00 - 20:00',
    ];

    // Filtrar rangos ocupados
    const bookedRanges = appointments.map((apt) => apt.appointmentTime);
    const availableRanges = allTimeRanges.filter(
      (range) => !bookedRanges.includes(range)
    );

    return NextResponse.json({
      date: date,
      availableRanges: availableRanges,
      bookedRanges: bookedRanges,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
