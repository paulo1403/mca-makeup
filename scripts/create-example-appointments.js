const { PrismaClient } = require('@prisma/client');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

async function createExampleAppointments() {
  try {
    console.log('🏗️ Creando citas de ejemplo...');

    // Ejemplos de citas completadas con reviews
    const exampleAppointments = [
      {
        clientName: 'Ana García',
        clientEmail: 'ana.garcia@email.com',
        clientPhone: '987 654 321',
        serviceType: 'Maquillaje de Novia',
        appointmentDate: new Date('2024-11-15'),
        appointmentTime: '09:00 - 13:00',
        duration: 240,
        status: 'COMPLETED',
        address: 'Av. Javier Prado 2458',
        addressReference: 'Edificio Torre Azul, piso 5',
        district: 'San Isidro',
        locationType: 'HOME',
        servicePrice: 400,
        transportCost: 30,
        totalPrice: 430,
        additionalNotes: 'Maquillaje para boda civil. Cliente prefiere tonos naturales.'
      },
      {
        clientName: 'María José López',
        clientEmail: 'mj.lopez@email.com',
        clientPhone: '912 345 678',
        serviceType: 'Maquillaje Social + Peinado',
        appointmentDate: new Date('2024-11-20'),
        appointmentTime: '16:00 - 19:00',
        duration: 180,
        status: 'COMPLETED',
        address: 'Calle Los Olivos 856',
        addressReference: 'Casa amarilla con portón negro',
        district: 'Miraflores',
        locationType: 'HOME',
        servicePrice: 350,
        transportCost: 25,
        totalPrice: 375,
        additionalNotes: 'Para evento de graduación. Look elegante pero juvenil.'
      },
      {
        clientName: 'Carmen Delgado',
        clientEmail: 'carmen.delgado@email.com',
        clientPhone: '956 789 123',
        serviceType: 'Maquillaje para Quinceañera',
        appointmentDate: new Date('2024-12-01'),
        appointmentTime: '10:00 - 14:00',
        duration: 240,
        status: 'COMPLETED',
        address: null,
        addressReference: null,
        district: null,
        locationType: 'STUDIO',
        servicePrice: 320,
        transportCost: 0,
        totalPrice: 320,
        additionalNotes: 'Quinceañera con temática princesa. Colores rosados y dorados.'
      }
    ];

    for (const appointmentData of exampleAppointments) {
      console.log(`📅 Creando cita para ${appointmentData.clientName}...`);

      // Crear la cita
      const appointment = await prisma.appointment.create({
        data: appointmentData
      });

      // Crear el review token para esta cita
      const reviewToken = randomUUID();

      const review = await prisma.review.create({
        data: {
          appointmentId: appointment.id,
          reviewToken: reviewToken,
          reviewerName: appointmentData.clientName,
          reviewerEmail: appointmentData.clientEmail,
          rating: null, // Se completará cuando la clienta haga la review
          reviewText: null,
          status: 'PENDING',
          isPublic: false
        }
      });

      console.log(`✅ Cita creada para ${appointmentData.clientName}`);
      console.log(`🔗 Link de review: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/review/${reviewToken}`);
      console.log('---');
    }

    // Crear algunas citas pendientes y confirmadas también
    const pendingAppointments = [
      {
        clientName: 'Sofia Mendoza',
        clientEmail: 'sofia.mendoza@email.com',
        clientPhone: '923 456 789',
        serviceType: 'Maquillaje Social',
        appointmentDate: new Date('2024-12-15'),
        appointmentTime: '15:00 - 17:00',
        duration: 120,
        status: 'PENDING',
        address: 'Jr. Cusco 1245',
        district: 'Lima',
        locationType: 'HOME',
        servicePrice: 250,
        transportCost: 20,
        totalPrice: 270,
        additionalNotes: 'Para cena de empresa. Look profesional pero elegante.'
      },
      {
        clientName: 'Lucia Rivera',
        clientEmail: 'lucia.rivera@email.com',
        clientPhone: '934 567 890',
        serviceType: 'Maquillaje de Novia + Peinado',
        appointmentDate: new Date('2024-12-20'),
        appointmentTime: '08:00 - 13:00',
        duration: 300,
        status: 'CONFIRMED',
        address: null,
        district: null,
        locationType: 'STUDIO',
        servicePrice: 500,
        transportCost: 0,
        totalPrice: 500,
        additionalNotes: 'Boda religiosa. Quiere look clásico y elegante que dure todo el día.'
      }
    ];

    for (const appointmentData of pendingAppointments) {
      console.log(`📅 Creando cita ${appointmentData.status} para ${appointmentData.clientName}...`);

      await prisma.appointment.create({
        data: appointmentData
      });

      console.log(`✅ Cita ${appointmentData.status} creada para ${appointmentData.clientName}`);
    }

    console.log('\n🎉 ¡Todas las citas de ejemplo han sido creadas exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('- 3 citas COMPLETADAS con reviews disponibles para probar');
    console.log('- 1 cita PENDIENTE');
    console.log('- 1 cita CONFIRMADA');
    console.log('\n💡 Puedes usar los links de review mostrados arriba para probar el sistema de reviews.');

  } catch (error) {
    console.error('❌ Error creando citas de ejemplo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createExampleAppointments();
