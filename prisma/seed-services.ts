import { PrismaClient, ServiceCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding services...');

  const services = [
    {
      name: 'Maquillaje de Novia - Paquete Básico',
      description: 'Paquete básico para novias incluye maquillaje el día de la boda',
      price: 480,
      duration: 150,
      category: ServiceCategory.BRIDAL,
    },
    {
      name: 'Maquillaje de Novia - Paquete Clásico',
      description: 'Paquete completo para novias incluye prueba previa y maquillaje el día de la boda',
      price: 980,
      duration: 150,
      category: ServiceCategory.BRIDAL,
    },
    {
      name: 'Maquillaje Social - Estilo Natural',
      description: 'Maquillaje natural para eventos sociales',
      price: 200,
      duration: 90,
      category: ServiceCategory.SOCIAL,
    },
    {
      name: 'Maquillaje Social - Estilo Glam',
      description: 'Maquillaje glamoroso para eventos especiales',
      price: 210,
      duration: 90,
      category: ServiceCategory.SOCIAL,
    },
    {
      name: 'Maquillaje para Piel Madura',
      description: 'Técnicas especializadas para piel madura',
      price: 230,
      duration: 90,
      category: ServiceCategory.MATURE_SKIN,
    },
    {
      name: 'Peinados',
      description: 'Peinados para eventos especiales',
      price: 65,
      duration: 60,
      category: ServiceCategory.HAIRSTYLE,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: service,
      create: service,
    });
    console.log(`✓ Created/Updated service: ${service.name}`);
  }

  console.log('Services seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
