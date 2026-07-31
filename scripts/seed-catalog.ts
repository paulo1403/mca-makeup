import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const img = (n: string) => `/media/canva-import/${n}.jpg`;
const png = (n: string) => `/media/canva-import/${n}.png`;

const services = [
  {
    name: "Maquillaje de Novia - Paquete Completo",
    description:
      "Look de novia de ensueño con prueba previa, peinado profesional y pestañas incluidas. Maquillaje a prueba de lágrimas y larga duración para que brilles en tu día más especial.",
    price: 420,
    duration: 150,
    category: "BRIDAL",
    cost: 140,
    images: ["001", "002", "003"],
  },
  {
    name: "Maquillaje Social / Eventos",
    description:
      "Maquillaje natural o glamoroso para fiestas, graduaciones, bautizos y celebraciones. Incluye pestañas y acabado profesional de larga duración.",
    price: 190,
    duration: 90,
    category: "SOCIAL",
    cost: 60,
    images: ["005", "006", "007"],
  },
  {
    name: "Maquillaje Piel Madura",
    description:
      "Técnica especializada para pieles maduras con productos que hidratan y realzan la belleza natural. Acabado luminoso y elegante sin marcar líneas de expresión.",
    price: 250,
    duration: 110,
    category: "MATURE_SKIN",
    cost: 80,
    images: ["008", "009", "010"],
  },
  {
    name: "Peinado Profesional",
    description:
      "Peinados elegantes para novias, madrinas, quinceañeras y eventos especiales. Recogidos clásicos, semirecogidos modernos o sueltos con ondas. Se realiza como servicio complementario al maquillaje.",
    price: 150,
    duration: 60,
    category: "HAIRSTYLE",
    cost: 40,
    images: ["011", "012", "013"],
  },
  {
    name: "Maquillaje Express - Retoque",
    description:
      "Maquillaje rápido y fresco para ocasiones de último minuto. Ideal para retoques antes de una sesión de fotos, entrevista o cena importante. Incluye aplicación en 30 minutos.",
    price: 120,
    duration: 30,
    category: "OTHER",
    cost: 35,
    images: ["004", "000"],
  },
];

async function main() {
  // Delete existing services (cascades ServiceImage)
  const existing = await prisma.service.findMany({ select: { id: true, name: true } });
  if (existing.length > 0) {
    console.log(`Deleting ${existing.length} existing services...`);
    for (const s of existing) {
      await prisma.serviceImage.deleteMany({ where: { serviceId: s.id } });
    }
    await prisma.service.deleteMany({});
  }

  for (const s of services) {
    await prisma.service.create({
      data: {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
        category: s.category as any,
        cost: s.cost,
        isActive: true,
        images: {
          create: s.images.map((f, i) => {
            const isPng = f === "004";
            return {
              url: isPng ? png(f) : img(f),
              isPrimary: i === 0,
              sortOrder: i,
              alt: s.name,
            };
          }),
        },
      },
    });
    console.log(`  ✓ ${s.name} (${s.images.length} imágenes)`);
  }

  console.log(`\n✅ ${services.length} servicios creados con imágenes desde MinIO.`);
  console.log("\nVer: https://mca-makeup.paulollanos.dev/servicios");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
