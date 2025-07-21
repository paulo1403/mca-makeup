import { PrismaClient, AppointmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleAppointments() {
  console.log('Creating sample appointments...');

  const appointments = [
    {
      clientName: 'Ana García',
      clientEmail: 'ana.garcia@email.com',
      clientPhone: '+51 987654321',
      serviceType: 'Maquillaje de Día',
      appointmentDate: new Date('2025-07-22'),
      appointmentTime: '09:00',
      status: 'CONFIRMED' as AppointmentStatus,
      additionalNotes: 'Prefiere tonos naturales',
      price: 80.0,
    },
    {
      clientName: 'María López',
      clientEmail: 'maria.lopez@email.com',
      clientPhone: '+51 987654322',
      serviceType: 'Maquillaje de Noche',
      appointmentDate: new Date('2025-07-22'),
      appointmentTime: '18:00',
      status: 'PENDING' as AppointmentStatus,
      additionalNotes: 'Evento especial - boda',
      price: 120.0,
    },
    {
      clientName: 'Carmen Rodriguez',
      clientEmail: 'carmen.rodriguez@email.com',
      clientPhone: '+51 987654323',
      serviceType: 'Maquillaje de Quinceañera',
      appointmentDate: new Date('2025-07-23'),
      appointmentTime: '14:00',
      status: 'CONFIRMED' as AppointmentStatus,
      additionalNotes: 'Colores rosados y dorados',
      price: 150.0,
    },
    {
      clientName: 'Lucía Hernández',
      clientEmail: 'lucia.hernandez@email.com',
      clientPhone: '+51 987654324',
      serviceType: 'Maquillaje de Día',
      appointmentDate: new Date('2025-07-24'),
      appointmentTime: '10:30',
      status: 'COMPLETED' as AppointmentStatus,
      additionalNotes: 'Cliente frecuente',
      price: 80.0,
    },
    {
      clientName: 'Patricia Vega',
      clientEmail: 'patricia.vega@email.com',
      clientPhone: '+51 987654325',
      serviceType: 'Maquillaje para Fotografía',
      appointmentDate: new Date('2025-07-25'),
      appointmentTime: '16:00',
      status: 'CONFIRMED' as AppointmentStatus,
      additionalNotes: 'Sesión de fotos profesional',
      price: 200.0,
    },
    {
      clientName: 'Sofia Torres',
      clientEmail: 'sofia.torres@email.com',
      clientPhone: '+51 987654326',
      serviceType: 'Maquillaje de Noche',
      appointmentDate: new Date('2025-07-26'),
      appointmentTime: '19:30',
      status: 'CANCELLED' as AppointmentStatus,
      additionalNotes: 'Cliente canceló por enfermedad',
      price: 120.0,
    },
    {
      clientName: 'Valeria Morales',
      clientEmail: 'valeria.morales@email.com',
      clientPhone: '+51 987654327',
      serviceType: 'Maquillaje de Día',
      appointmentDate: new Date('2025-07-28'),
      appointmentTime: '11:00',
      status: 'PENDING' as AppointmentStatus,
      additionalNotes: 'Primera vez como cliente',
      price: 80.0,
    },
    {
      clientName: 'Adriana Castro',
      clientEmail: 'adriana.castro@email.com',
      clientPhone: '+51 987654328',
      serviceType: 'Maquillaje de Novias',
      appointmentDate: new Date('2025-07-30'),
      appointmentTime: '08:00',
      status: 'CONFIRMED' as AppointmentStatus,
      additionalNotes: 'Boda en jardín - maquillaje duradero',
      price: 250.0,
    },
  ];

  try {
    for (const appointment of appointments) {
      await prisma.appointment.create({
        data: appointment,
      });
      console.log(`✓ Created appointment for ${appointment.clientName}`);
    }

    console.log(`\n✅ Successfully created ${appointments.length} sample appointments!`);
  } catch (error) {
    console.error('❌ Error creating appointments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleAppointments();
