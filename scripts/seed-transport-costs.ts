import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRANSPORT_COSTS_DATA = [
  // Lima Centro
  { district: "Lima", cost: 25.00, notes: "Zona céntrica" },
  { district: "Cercado de Lima", cost: 25.00, notes: "Centro histórico" },
  { district: "Breña", cost: 20.00, notes: "Zona cercana" },
  { district: "La Victoria", cost: 25.00, notes: "Zona comercial" },
  { district: "Rímac", cost: 30.00, notes: "Incluye peaje" },

  // Lima Norte
  { district: "San Martin de Porres", cost: 35.00, notes: "Lima Norte" },
  { district: "Los Olivos", cost: 40.00, notes: "Lima Norte" },
  { district: "Independencia", cost: 35.00, notes: "Lima Norte" },
  { district: "Comas", cost: 45.00, notes: "Lima Norte - zona lejana" },
  { district: "Carabayllo", cost: 50.00, notes: "Lima Norte - zona lejana" },
  { district: "Puente Piedra", cost: 55.00, notes: "Lima Norte - zona muy lejana" },
  { district: "Santa Rosa", cost: 60.00, notes: "Lima Norte - zona muy lejana" },

  // Lima Sur
  { district: "San Juan de Miraflores", cost: 35.00, notes: "Lima Sur" },
  { district: "Villa María del Triunfo", cost: 40.00, notes: "Lima Sur" },
  { district: "Villa El Salvador", cost: 45.00, notes: "Lima Sur" },
  { district: "Chorrillos", cost: 30.00, notes: "Lima Sur - acceso directo" },
  { district: "Barranco", cost: 25.00, notes: "Zona turística" },
  { district: "Surco", cost: 30.00, notes: "Lima moderna" },
  { district: "Santiago de Surco", cost: 30.00, notes: "Lima moderna" },
  { district: "San Borja", cost: 25.00, notes: "Lima moderna" },
  { district: "Surquillo", cost: 20.00, notes: "Zona cercana" },

  // Lima Este
  { district: "San Juan de Lurigancho", cost: 40.00, notes: "Lima Este" },
  { district: "El Agustino", cost: 35.00, notes: "Lima Este" },
  { district: "Santa Anita", cost: 35.00, notes: "Lima Este" },
  { district: "La Molina", cost: 40.00, notes: "Lima Este - zona residencial" },
  { district: "Ate", cost: 35.00, notes: "Lima Este" },
  { district: "Chaclacayo", cost: 60.00, notes: "Lima Este - zona lejana" },
  { district: "Lurigancho", cost: 50.00, notes: "Lima Este - zona lejana" },

  // Lima Oeste
  { district: "Callao", cost: 30.00, notes: "Provincia del Callao" },
  { district: "Bellavista", cost: 30.00, notes: "Provincia del Callao" },
  { district: "La Perla", cost: 30.00, notes: "Provincia del Callao" },
  { district: "Carmen de la Legua", cost: 35.00, notes: "Provincia del Callao" },
  { district: "Ventanilla", cost: 45.00, notes: "Callao - zona lejana" },

  // Distritos residenciales/exclusivos
  { district: "Miraflores", cost: 25.00, notes: "Zona turística y comercial" },
  { district: "San Isidro", cost: 25.00, notes: "Distrito financiero" },
  { district: "Lince", cost: 20.00, notes: "Zona céntrica" },
  { district: "Jesús María", cost: 20.00, notes: "Zona céntrica" },
  { district: "Magdalena del Mar", cost: 20.00, notes: "Zona costera" },
  { district: "Pueblo Libre", cost: 15.00, notes: "Distrito base - cerca del local" },
  { district: "San Miguel", cost: 20.00, notes: "Zona cercana" },
  { district: "La Molina", cost: 40.00, notes: "Zona residencial exclusiva" },

  // Otros distritos importantes
  { district: "Manco Cápac", cost: 35.00, notes: "Zona intermedia" },
  { district: "San Luis", cost: 25.00, notes: "Zona céntrica" },
  { district: "Santa Catalina", cost: 25.00, notes: "Zona intermedia" },
];

async function seedTransportCosts() {
  try {
    console.log('🚛 Iniciando inserción de costos de transporte...');

    // Limpiar datos existentes (opcional)
    await prisma.transportCost.deleteMany({});
    console.log('✅ Datos anteriores limpiados');

    // Insertar nuevos datos
    const created = await prisma.transportCost.createMany({
      data: TRANSPORT_COSTS_DATA,
      skipDuplicates: true,
    });

    console.log(`✅ ${created.count} costos de transporte insertados exitosamente`);

    // Mostrar resumen por rangos de precio
    const summary = await prisma.transportCost.groupBy({
      by: ['cost'],
      _count: true,
      orderBy: {
        cost: 'asc',
      },
    });

    console.log('\n📊 Resumen de costos:');
    summary.forEach(({ cost, _count }) => {
      console.log(`  S/ ${cost.toFixed(2)}: ${_count} distrito(s)`);
    });

    // Mostrar algunos ejemplos
    console.log('\n🏘️  Ejemplos de distritos:');
    const examples = await prisma.transportCost.findMany({
      take: 10,
      orderBy: {
        cost: 'asc',
      },
      select: {
        district: true,
        cost: true,
        notes: true,
      },
    });

    examples.forEach(({ district, cost, notes }) => {
      console.log(`  ${district}: S/ ${cost.toFixed(2)} ${notes ? `(${notes})` : ''}`);
    });

    console.log('\n🎉 ¡Seed de costos de transporte completado!');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si se llama directamente
if (require.main === module) {
  seedTransportCosts();
}

export default seedTransportCosts;
