import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const c = (name: string) => `/media/catalog-images/${name}.jpg`;
const canva = (n: string) => `/media/canva-import/${n}.jpg`;
const canvaPng = (n: string) => `/media/canva-import/${n}.png`;
const v = (name: string) => `/media/catalog-videos/${name}.mp4`;

const services = [
  {
    name: "Maquillaje de Novia - Paquete Completo",
    description:
      "Look de novia de ensueño con prueba previa, peinado profesional y pestañas incluidas. Maquillaje a prueba de lágrimas y larga duración para que brilles en tu día más especial.",
    price: 420,
    duration: 150,
    category: "BRIDAL",
    cost: 140,
    images: [c("picsum-bridal"), c("picsum-bride"), c("1616394584738-fc6e612e71b9")],
    videoUrl: v("39899-720"),
  },
  {
    name: "Maquillaje Social / Eventos",
    description:
      "Maquillaje natural o glamoroso para fiestas, graduaciones, bautizos y celebraciones. Incluye pestañas y acabado profesional de larga duración.",
    price: 190,
    duration: 90,
    category: "SOCIAL",
    cost: 60,
    images: [c("picsum-elegant"), c("picsum-glamour"), c("picsum-makeup")],
    videoUrl: v("41058-720"),
  },
  {
    name: "Maquillaje Piel Madura",
    description:
      "Técnica especializada para pieles maduras con productos que hidratan y realzan la belleza natural. Acabado luminoso y elegante sin marcar líneas de expresión.",
    price: 250,
    duration: 110,
    category: "MATURE_SKIN",
    cost: 80,
    images: [c("picsum-beauty"), c("picsum-portrait"), c("1596462502278-27bfdc403348")],
  },
  {
    name: "Peinado Profesional",
    description:
      "Peinados elegantes para novias, madrinas, quinceañeras y eventos especiales. Recogidos clásicos, semirecogidos modernos o sueltos con ondas. Se realiza como servicio complementario al maquillaje.",
    price: 150,
    duration: 60,
    category: "HAIRSTYLE",
    cost: 40,
    images: [c("picsum-hairstyle"), c("1522337360788-8b13dee7a37e"), canva("011")],
  },
  {
    name: "Maquillaje Express - Retoque Rápido",
    description:
      "Maquillaje rápido y fresco para ocasiones de último minuto. Ideal para retoques antes de una sesión de fotos, entrevista o cena importante. Aplicación en 30 minutos.",
    price: 120,
    duration: 30,
    category: "OTHER",
    cost: 35,
    images: [c("1519699047748-de8e457a634e"), canva("004")],
  },
];

async function main() {
  // Drop existing services (cascade)
  const existing = await prisma.service.findMany({ select: { id: true } });
  for (const s of existing) {
    await prisma.serviceImage.deleteMany({ where: { serviceId: s.id } });
  }
  await prisma.service.deleteMany({});

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
        videoUrl: s.videoUrl || null,
        images: {
          create: s.images.map((url, i) => ({
            url,
            isPrimary: i === 0,
            sortOrder: i,
            alt: s.name,
          })),
        },
      },
    });
    console.log(`  ✓ ${s.name}${s.videoUrl ? " 🎬" : ""}`);
  }

  console.log(`\n✅ ${services.length} servicios actualizados con imágenes y videos.`);
  console.log("Ver: https://mca-makeup.paulollanos.dev/servicios");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
