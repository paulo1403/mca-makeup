import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sendEmail, emailTemplates } from '@/lib/email';

const prisma = new PrismaClient();

// Validation schema
const appointmentSchema = z.object({
  clientName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  clientEmail: z.string().email('Email inválido'),
  clientPhone: z.string().min(10, 'Teléfono inválido'),
  serviceType: z.string().min(1, 'Tipo de servicio requerido'),
  appointmentDate: z.string().min(1, 'Fecha requerida'),
  appointmentTime: z.string().min(1, 'Hora requerida'),
  additionalNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = appointmentSchema.parse(body);

    // Parse date
    const appointmentDateTime = new Date(validatedData.appointmentDate);

    // Check if the appointment slot is available
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        appointmentDate: appointmentDateTime,
        appointmentTime: validatedData.appointmentTime,
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
        appointmentTime: validatedData.appointmentTime,
        additionalNotes: validatedData.additionalNotes || '',
        status: 'PENDING',
      },
    });

    // Send notification emails
    try {
      const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      };

      const formatTime = (time: string) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        });
      };

      // Send notification to admin/Marcela
      if (process.env.ADMIN_EMAIL) {
        const adminEmailData = emailTemplates.newAppointmentAlert(
          appointment.clientName,
          appointment.serviceType,
          formatDate(appointment.appointmentDate),
          formatTime(appointment.appointmentTime),
          appointment.clientEmail,
          appointment.clientPhone
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
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
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

    // Define available time slots
    const allTimeSlots = [
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];

    // Filter out booked slots
    const bookedSlots = appointments.map((apt) => apt.appointmentTime);
    const availableSlots = allTimeSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    return NextResponse.json({
      date: date,
      availableSlots: availableSlots,
      bookedSlots: bookedSlots,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
