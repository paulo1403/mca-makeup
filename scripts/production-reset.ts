import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetProductionDB() {
  try {
    console.log('🚨 RESETEANDO BASE DE DATOS DE PRODUCCIÓN...');
    console.log('⚠️  ESTO ELIMINARÁ TODOS LOS DATOS EXISTENTES');

    // Confirmar que estamos en producción
    if (process.env.NODE_ENV !== 'production') {
      console.log('❌ Este script solo debe ejecutarse en producción');
      process.exit(1);
    }

    // Verificar variables de entorno requeridas
    const requiredEnvs = ['DATABASE_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
    for (const env of requiredEnvs) {
      if (!process.env[env]) {
        console.log(`❌ Variable de entorno requerida: ${env}`);
        process.exit(1);
      }
    }

    console.log('🗑️  Limpiando tablas...');

    // Limpiar todas las tablas en orden correcto (por dependencias)
    await prisma.review.deleteMany({});
    await prisma.appointment.deleteMany({});
    await prisma.specialAvailability.deleteMany({});
    await prisma.regularAvailability.deleteMany({});
    await prisma.transportCost.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.errorReport.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.appSetting.deleteMany({});

    console.log('✅ Tablas limpiadas');

    // 1. Crear Usuario Administrador
    console.log('👤 Creando usuario administrador...');
    const adminEmail = process.env.ADMIN_EMAIL!;
    const adminPassword = process.env.ADMIN_PASSWORD!;
    const adminName = process.env.ADMIN_NAME || 'Marcela Cordero';

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'ADMIN',
      },
    });

    console.log(`✅ Usuario administrador creado: ${adminEmail}`);

    // 2. Crear Servicios
    console.log('💄 Creando servicios...');
    const services = [
      // Servicios de Novia
      {
        name: 'Maquillaje de Novia - Paquete Básico',
        price: 480.0,
        duration: 180,
        category: 'BRIDAL',
        description: 'Maquillaje completo para el día más especial. Incluye: maquillaje base, ojos, labios y fijación.',
        isActive: true,
      },
      {
        name: 'Maquillaje de Novia - Paquete Clásico',
        price: 980.0,
        duration: 240,
        category: 'BRIDAL',
        description: 'Incluye prueba previa (1 hora) + maquillaje del día de la boda (4 horas) + retoque.',
        isActive: true,
      },

      // Servicios Sociales
      {
        name: 'Maquillaje Social - Estilo Natural',
        price: 200.0,
        duration: 120,
        category: 'SOCIAL',
        description: 'Look natural y fresco para eventos del día. Perfecto para graduaciones, bautizos, etc.',
        isActive: true,
      },
      {
        name: 'Maquillaje Social - Estilo Glam',
        price: 210.0,
        duration: 130,
        category: 'SOCIAL',
        description: 'Look glamoroso para eventos de noche. Incluye maquillaje intenso y duradero.',
        isActive: true,
      },

      // Servicios para Piel Madura
      {
        name: 'Maquillaje Piel Madura - Natural',
        price: 250.0,
        duration: 150,
        category: 'MATURE_SKIN',
        description: 'Técnicas especializadas para piel madura. Realza la belleza natural con productos específicos.',
        isActive: true,
      },

      // Servicios de Peinado
      {
        name: 'Peinado Simple',
        price: 80.0,
        duration: 60,
        category: 'HAIRSTYLE',
        description: 'Peinado básico y elegante. Perfecto para complementar el maquillaje.',
        isActive: true,
      },
      {
        name: 'Peinado Elaborado',
        price: 120.0,
        duration: 90,
        category: 'HAIRSTYLE',
        description: 'Peinado sofisticado con técnicas avanzadas. Ideal para eventos especiales.',
        isActive: true,
      },
    ];

    for (const service of services) {
      await prisma.service.create({ data: service });
    }

    console.log(`✅ ${services.length} servicios creados`);

    // 3. Crear Costos de Transporte
    console.log('🚗 Creando costos de transporte...');
    const transportCosts = [
      { district: "Pueblo Libre", cost: 0.0, notes: "Ubicación del estudio - Av. Bolívar 1073" },
      { district: "Magdalena del Mar", cost: 15.0 },
      { district: "San Miguel", cost: 15.0 },
      { district: "Jesús María", cost: 20.0 },
      { district: "Lince", cost: 20.0 },
      { district: "Breña", cost: 20.0 },
      { district: "Lima Cercado", cost: 25.0 },
      { district: "La Victoria", cost: 25.0 },
      { district: "Miraflores", cost: 30.0 },
      { district: "San Isidro", cost: 30.0 },
      { district: "Barranco", cost: 25.0 },
      { district: "Chorrillos", cost: 30.0 },
      { district: "Surquillo", cost: 20.0 },
      { district: "San Borja", cost: 25.0 },
      { district: "Santiago de Surco", cost: 30.0 },
      { district: "La Molina", cost: 40.0 },
      { district: "Ate", cost: 35.0 },
      { district: "Santa Anita", cost: 35.0 },
      { district: "San Juan de Lurigancho", cost: 40.0 },
      { district: "El Agustino", cost: 35.0 },
      { district: "Callao", cost: 30.0 },
      { district: "Bellavista", cost: 30.0 },
      { district: "La Perla", cost: 30.0 },
      { district: "Ventanilla", cost: 45.0 },
      { district: "Los Olivos", cost: 40.0 },
      { district: "San Martín de Porres", cost: 35.0 },
      { district: "Independencia", cost: 35.0 },
      { district: "Comas", cost: 45.0 },
    ];

    for (const transport of transportCosts) {
      await prisma.transportCost.create({ data: transport });
    }

    console.log(`✅ ${transportCosts.length} costos de transporte creados`);

    // 4. Crear Disponibilidad Regular
    console.log('📅 Creando disponibilidad regular...');
    const { LocationType } = await import('@prisma/client');

    const regularAvailability = [
      // Martes - STUDIO
      { dayOfWeek: 2, startTime: "09:00", endTime: "13:00", locationType: LocationType.STUDIO },
      { dayOfWeek: 2, startTime: "14:00", endTime: "18:00", locationType: LocationType.STUDIO },

      // Martes - HOME
      { dayOfWeek: 2, startTime: "10:00", endTime: "16:00", locationType: LocationType.HOME },

      // Miércoles - STUDIO
      { dayOfWeek: 3, startTime: "09:00", endTime: "13:00", locationType: LocationType.STUDIO },
      { dayOfWeek: 3, startTime: "14:00", endTime: "18:00", locationType: LocationType.STUDIO },

      // Miércoles - HOME
      { dayOfWeek: 3, startTime: "10:00", endTime: "16:00", locationType: LocationType.HOME },

      // Jueves - STUDIO
      { dayOfWeek: 4, startTime: "09:00", endTime: "13:00", locationType: LocationType.STUDIO },
      { dayOfWeek: 4, startTime: "14:00", endTime: "18:00", locationType: LocationType.STUDIO },

      // Jueves - HOME
      { dayOfWeek: 4, startTime: "10:00", endTime: "16:00", locationType: LocationType.HOME },

      // Viernes - STUDIO
      { dayOfWeek: 5, startTime: "09:00", endTime: "13:00", locationType: LocationType.STUDIO },
      { dayOfWeek: 5, startTime: "14:00", endTime: "18:00", locationType: LocationType.STUDIO },

      // Viernes - HOME
      { dayOfWeek: 5, startTime: "10:00", endTime: "16:00", locationType: LocationType.HOME },

      // Sábado - STUDIO (horario extendido)
      { dayOfWeek: 6, startTime: "08:00", endTime: "12:00", locationType: LocationType.STUDIO },
      { dayOfWeek: 6, startTime: "13:00", endTime: "17:00", locationType: LocationType.STUDIO },
      { dayOfWeek: 6, startTime: "18:00", endTime: "21:00", locationType: LocationType.STUDIO },

      // Sábado - HOME
      { dayOfWeek: 6, startTime: "09:00", endTime: "17:00", locationType: LocationType.HOME },
    ];

    for (const availability of regularAvailability) {
      await prisma.regularAvailability.create({ data: availability });
    }

    console.log(`✅ ${regularAvailability.length} horarios regulares creados`);

    // 5. Crear Configuraciones de la App
    console.log('⚙️  Creando configuraciones de la app...');
    const appSettings = [
      {
        key: "site_title",
        value: "Marcela Cordero - Makeup Artist",
        description: "Título del sitio web",
      },
      {
        key: "contact_phone",
        value: "+51 989 164 990",
        description: "Teléfono de contacto principal",
      },
      {
        key: "contact_email",
        value: process.env.ADMIN_EMAIL,
        description: "Email de contacto principal",
      },
      {
        key: "instagram_url",
        value: "https://www.instagram.com/marcelacorderobeauty/",
        description: "URL de Instagram",
      },
      {
        key: "studio_address",
        value: "Av. Bolívar 1073, Pueblo Libre, Lima",
        description: "Dirección del estudio",
      },
      {
        key: "booking_enabled",
        value: "true",
        description: "Habilitar sistema de reservas online",
      },
      {
        key: "maintenance_mode",
        value: "false",
        description: "Modo mantenimiento",
      },
    ];

    for (const setting of appSettings) {
      await prisma.appSetting.create({ data: setting });
    }

    console.log(`✅ ${appSettings.length} configuraciones creadas`);

    console.log('\n🎉 ¡Base de datos de producción reseteada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   👤 1 usuario administrador`);
    console.log(`   💄 ${services.length} servicios`);
    console.log(`   🚗 ${transportCosts.length} costos de transporte`);
    console.log(`   📅 ${regularAvailability.length} horarios regulares`);
    console.log(`   ⚙️  ${appSettings.length} configuraciones`);
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Verificar que el sitio web esté funcionando');
    console.log('   2. Probar el sistema de reservas');
    console.log('   3. Verificar el panel de administración');
    console.log('   4. Configurar horarios específicos si es necesario');

  } catch (error) {
    console.error('❌ Error durante el reset:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el reset si se llama directamente
if (require.main === module) {
  resetProductionDB();
}

export default resetProductionDB;
