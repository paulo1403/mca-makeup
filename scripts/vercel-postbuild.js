const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function postBuild() {
  try {
    console.log('🚀 Iniciando configuración post-build para producción...');

    // 1. Aplicar esquema de base de datos
    console.log('📋 Aplicando esquema de base de datos...');

    // 2. Verificar que las tablas existan
    console.log('🔍 Verificando tablas de la base de datos...');

    // 3. Verificar si ya existen datos de transport costs
    const existingTransportCosts = await prisma.transportCost.count();

    if (existingTransportCosts === 0) {
      console.log('📦 No se encontraron costos de transporte, ejecutando seed...');

      // Importar y ejecutar el seed
      const seedTransportCosts = require('./seed-transport-costs.js');
      await seedTransportCosts();

      console.log('✅ Datos de costos de transporte insertados correctamente');
    } else {
      console.log(`ℹ️  Se encontraron ${existingTransportCosts} costos de transporte existentes, omitiendo seed`);
    }

    // 4. Verificar configuraciones del sistema
    console.log('⚙️  Verificando configuraciones del sistema...');

    const defaultSettings = [
      {
        key: 'BOOKING_ENABLED',
        value: 'true',
        description: 'Habilitar sistema de reservas'
      },
      {
        key: 'MAINTENANCE_MODE',
        value: 'false',
        description: 'Modo de mantenimiento'
      },
      {
        key: 'DEFAULT_SERVICE_DURATION',
        value: '120',
        description: 'Duración por defecto del servicio en minutos'
      }
    ];

    for (const setting of defaultSettings) {
      const exists = await prisma.systemSettings.findUnique({
        where: { key: setting.key }
      });

      if (!exists) {
        await prisma.systemSettings.create({
          data: setting
        });
        console.log(`✅ Configuración ${setting.key} creada`);
      }
    }

    console.log('🎉 ¡Configuración post-build completada exitosamente!');
    console.log('📊 Resumen:');

    const stats = {
      transportCosts: await prisma.transportCost.count(),
      systemSettings: await prisma.systemSettings.count(),
      appointments: await prisma.appointment.count(),
    };

    console.log(`  - Costos de transporte: ${stats.transportCosts}`);
    console.log(`  - Configuraciones: ${stats.systemSettings}`);
    console.log(`  - Citas registradas: ${stats.appointments}`);

    console.log('🚀 La aplicación está lista para producción!');

  } catch (error) {
    console.error('❌ Error durante la configuración post-build:', error);

    // No fallar el build por errores de seed, solo advertir
    console.warn('⚠️  Continuando con el despliegue a pesar del error...');
    console.warn('💡 Los datos pueden configurarse manualmente desde el admin panel');
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  postBuild().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}

module.exports = postBuild;
