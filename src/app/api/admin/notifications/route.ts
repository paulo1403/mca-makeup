import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/notifications - Get notifications for admin
export async function GET() {
  try {
    // Por ahora, generamos notificaciones dinámicamente basadas en citas pendientes
    // En el futuro, podrías crear una tabla de notificaciones en la base de datos
    
    const pendingAppointments = await prisma.appointment.findMany({
      where: {
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const notifications = pendingAppointments.map(appointment => {
      const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      };

      const formatTime = (time: string) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        });
      };

      return {
        id: `appointment-${appointment.id}`,
        type: 'appointment' as const,
        title: 'Nueva cita pendiente',
        message: `${appointment.clientName} solicita ${appointment.serviceType} para el ${formatDate(appointment.appointmentDate)} a las ${formatTime(appointment.appointmentTime)}`,
        link: '/admin/appointments',
        createdAt: appointment.createdAt.toISOString(),
        read: false,
      };
    });

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/notifications - Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;

    // Por ahora, como las notificaciones son dinámicas, solo devolvemos éxito
    // En el futuro, actualizarías el estado en la base de datos
    console.log(`Marking notification ${id} as read: ${read}`);

    return NextResponse.json({
      success: true,
      message: 'Notification updated successfully',
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
