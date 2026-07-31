import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@prisma/client";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const img = (n: string) => `/media/canva-import/${n}.jpg`;

const samples = [
  {
    name: "Maquillaje de Novia - Paquete Completo",
    description:
      "Look de novia de larga duración con prueba previa incluida, peinado y pestañas.",
    price: 380,
    duration: 120,
    category: "BRIDAL",
    cost: 120,
    images: [img("001"), img("002"), img("003")],
  },
  {
    name: "Maquillaje Social / Eventos",
    description: "Maquillaje natural o glamoroso para eventos y celebraciones. Duración 1h30-2h.",
    price: 190,
    duration: 90,
    category: "SOCIAL",
    cost: 60,
    images: [img("005"), img("006"), img("007")],
  },
  {
    name: "Maquillaje Piel Madura",
    description: "Técnicas especializadas para un acabado luminoso y natural en piel madura.",
    price: 220,
    duration: 100,
    category: "MATURE_SKIN",
    cost: 70,
    images: [img("008"), img("009"), img("010")],
  },
];

async function main() {
  for (const s of samples) {
    const existing = await prisma.service.findUnique({ where: { name: s.name } });
    if (existing) {
      console.log(`skip (exists): ${s.name}`);
      continue;
    }
    await prisma.service.create({
      data: {
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
        category: s.category as never,
        cost: s.cost,
        isActive: true,
        images: {
          create: s.images.map((url, i) => ({
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
      },
    });
    console.log(`created: ${s.name}`);
  }
  console.log("done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
