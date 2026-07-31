import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { randomUUID } from "crypto";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const CLIENTS = [
  { name: "Camila Torres", email: "camila.torres@gmail.com", phone: "999111222" },
  { name: "Valentina Rojas", email: "valentina.rojas@outlook.com", phone: "999333444" },
  { name: "Alessandra Muñoz", email: "alessandra.m@gmail.com", phone: "999555666" },
  { name: "Gabriela Paredes", email: "gabriela.paredes@hotmail.com", phone: "999777888" },
  { name: "Fernanda Castillo", email: "fernanda.castillo@gmail.com", phone: "998111333" },
  { name: "María José Delgado", email: "mj.delgado@outlook.com", phone: "998444555" },
  { name: "Ximena Vargas", email: "ximena.vargas@gmail.com", phone: "998666777" },
  { name: "Daniela Salazar", email: "daniela.salazar@icloud.com", phone: "998888999" },
  { name: "Sofía Mendoza", email: "sofia.mendoza@gmail.com", phone: "997111444" },
  { name: "Luciana Huamán", email: "luciana.h@gmail.com", phone: "997222555" },
  { name: "Andrea Quispe", email: "andrea.quispe@outlook.com", phone: "997333666" },
  { name: "Rosa Fernández", email: "rosa.fernandez@gmail.com", phone: "997444777" },
  { name: "Carla Espinoza", email: "carla.espinoza@icloud.com", phone: "996111888" },
  { name: "Paola Gutiérrez", email: "paola.gutierrez@gmail.com", phone: "996222999" },
  { name: "Natalia Romero", email: "natalia.romero@outlook.com", phone: "996333000" },
  { name: "Brenda León", email: "brenda.leon@gmail.com", phone: "996444111" },
  { name: "Stephanie Chávez", email: "stephanie.chavez@gmail.com", phone: "995111222" },
  { name: "Katherine Díaz", email: "katherine.diaz@hotmail.com", phone: "995222333" },
  { name: "Patricia Álvarez", email: "patricia.alvarez@icloud.com", phone: "995333444" },
  { name: "Diana Rivera", email: "diana.rivera@gmail.com", phone: "995444555" },
  { name: "Lorena Silva", email: "lorena.silva@outlook.com", phone: "994111666" },
  { name: "Carolina Tapia", email: "carolina.tapia@gmail.com", phone: "994222777" },
  { name: "Vanessa Córdova", email: "vanessa.cordova@gmail.com", phone: "994333888" },
  { name: "Alejandra Puma", email: "ale.puma@icloud.com", phone: "994444999" },
  { name: "Micaela Vega", email: "micaela.vega@gmail.com", phone: "993111000" },
  { name: "Renata Flores", email: "renata.flores@outlook.com", phone: "993222111" },
  { name: "Mariana Loayza", email: "mariana.loayza@icloud.com", phone: "993333222" },
  { name: "Isabel Guerrero", email: "isabel.guerrero@gmail.com", phone: "993444333" },
  { name: "Fabiola Miranda", email: "fabiola.miranda@gmail.com", phone: "992111444" },
  { name: "Tatiana Ríos", email: "tatiana.rios@hotmail.com", phone: "992222555" },
];

const DISTRICTS = [
  "Miraflores", "San Isidro", "Barranco", "San Borja",
  "La Molina", "Surco", "Jesús María", "Pueblo Libre",
  "Magdalena", "Lince", "San Miguel", "Cercado de Lima",
];

const REVIEW_TEXTS = [
  "Excelente servicio, Marcela es una profesional increíble. Quedé muy contenta con el resultado.",
  "Muy buena atención, el maquillaje duró todo el día. Recomendada 100%.",
  "La prueba de maquillaje fue muy útil, el día de la boda todo salió perfecto.",
  "Me encantó el resultado, muy natural y elegante. Volveré a agendar.",
  "Profesionalismo y calidad. Marcela entendió exactamente lo que quería.",
  "Hermoso trabajo, recibí muchos cumplidos en el evento. Gracias Marcela.",
  "Puntual, detallista y con mucho talento. Sin duda la mejor maquilladora.",
  "Quedé fascinada con el maquillaje para mi graduación. Súper recomendada.",
  "El maquillaje para piel madura quedó natural y luminoso. Excelente técnica.",
  "Muy conforme con el servicio a domicilio. Llegó puntual y el maquillaje impecable.",
];

const REVIEW_NAMES_RESPONSES = [
  { name: "C.", response: "¡Gracias por confiar en mí! Fue un placer maquillarte en tu día especial. 💄" },
  { name: "Valeria", response: "Muchas gracias por tus palabras. Me alegra mucho que te haya gustado el resultado. ✨" },
  { name: "A.", response: "¡Gracias! Trabajar contigo fue muy lindo. Espero verte pronto. 🥰" },
  { name: "G.", response: "Gracias por tu confianza. Me esforcé para que lucieras radiante. 🌟" },
  { name: "M.", response: "¡Qué lindo mensaje! Me motiva a seguir mejorando cada día. 💕" },
  { name: "S.", response: "Agradecida siempre. Tu sonrisa al verte fue mi mejor recompensa. 😊" },
  { name: "Fam. Castillo", response: "Gracias por permitirme ser parte de su celebración. Bendiciones. 🙌" },
  { name: "D.", response: "Me encanta saber que te sentiste hermosa. ¡Ese es el objetivo! ❤️" },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(d: Date): string {
  return d.toISOString();
}

// Generate appointments for one month
function generateMonthAppointments(
  year: number,
  month: number,
  count: number,
  serviceIds: Record<string, string>,
  monthNames: string[],
  usedClients: Set<number>,
) {
  const appointments: any[] = [];
  const done = new Set<number>();
  let attempts = 0;

  while (appointments.length < count && attempts < 100) {
    attempts++;
    const day = randomInt(1, 28);
    const key = `${year}-${month}-${day}`;
    if (done.has(key)) continue;
    done.add(key);

    let clientIdx = randomInt(0, CLIENTS.length - 1);
    if (!usedClients.has(clientIdx)) {
      usedClients.add(clientIdx);
      // keep it
    }
    const client = CLIENTS[clientIdx];

    const serviceType = pick(Object.keys(serviceIds));
    const service = { id: serviceIds[serviceType], name: "", price: 0, duration: 0, category: "" };
    // We'll fill service details below

    const isWeekend = new Date(year, month - 1, day).getDay() >= 5;
    const baseStatus = pick(["COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "CANCELLED", "COMPLETED", "PENDING"]);

    // Map category to service type string
    const catLabels: Record<string, string> = {
      BRIDAL: "Maquillaje de Novia",
      SOCIAL: "Maquillaje Social",
      MATURE_SKIN: "Maquillaje Piel Madura",
      HAIRSTYLE: "Peinado",
    };

    const hour = randomInt(9, 17);
    const timeStr = `${hour.toString().padStart(2, "0")}:00`;
    const dateObj = new Date(year, month - 1, day, hour, 0, 0);

    // Extra services sometimes
    const hasTransport = isWeekend || Math.random() > 0.7;
    const hasNightShift = hour >= 18 || Math.random() > 0.9;
    const transportCost = hasTransport ? pick([15, 20, 25, 30]) : 0;
    const nightShiftCost = hasNightShift ? pick([30, 40, 50]) : 0;

    // Determine actual services based on type
    let services: any[] = [];
    let totalPrice = 0;
    let totalDuration = 0;
    let serviceTypeStr = "";

    if (serviceType === "BRIDAL") {
      services = [{ id: serviceIds.BRIDAL, name: "Maquillaje de Novia - Paquete Completo", price: 380, duration: 120, category: "BRIDAL" }];
      totalPrice = 380;
      totalDuration = 120;
      serviceTypeStr = "Novia";
    } else if (serviceType === "SOCIAL") {
      services = [{ id: serviceIds.SOCIAL, name: "Maquillaje Social / Eventos", price: 190, duration: 90, category: "SOCIAL" }];
      totalPrice = 190;
      totalDuration = 90;
      serviceTypeStr = "Social/Eventos";
    } else if (serviceType === "MATURE_SKIN") {
      services = [{ id: serviceIds.MATURE_SKIN, name: "Maquillaje Piel Madura", price: 220, duration: 100, category: "MATURE_SKIN" }];
      totalPrice = 220;
      totalDuration = 100;
      serviceTypeStr = "Piel Madura";
    }

    totalPrice += transportCost + nightShiftCost;

    appointments.push({
      client,
      serviceType: serviceTypeStr,
      date: dateObj,
      time: timeStr,
      duration: totalDuration,
      status: baseStatus,
      locationType: hasTransport ? "HOME" : "STUDIO",
      district: hasTransport ? pick(DISTRICTS) : null,
      address: hasTransport ? "Av. Principal 123" : null,
      addressReference: hasTransport ? "Altura cuadra 5" : null,
      servicePrice: totalPrice - transportCost - nightShiftCost,
      totalPrice,
      transportCost,
      nightShiftCost,
      services,
      totalDuration,
      notes: Math.random() > 0.7 ? pick(["Llegar 15 min antes", "Preferencia tonos cálidos", "Alergia a pestañas", "Piel sensible"]) : null,
    });
  }
  return appointments;
}

async function main() {
  const existing = await prisma.service.findMany();
  if (existing.length === 0) {
    console.log("No services found. Run seed-services-demo.ts first.");
    process.exit(1);
  }

  const serviceIds: Record<string, string> = {};
  for (const s of existing) {
    serviceIds[s.category] = s.id;
  }
  console.log(`Found ${existing.length} services`);

  // Remove old test appointments (from previous demo seeds)
  await prisma.review.deleteMany({});
  await prisma.financeEntry.deleteMany({ where: { source: "APPOINTMENT" } });
  await prisma.financeEntry.deleteMany({ where: {} });
  const deleted = await prisma.appointment.deleteMany({});
  console.log(`Deleted ${deleted.count} existing appointments`);

  const usedClients = new Set<number>();
  const allAppts: any[] = [];

  // 5 months: March - July 2026
  const monthlyCounts = [8, 6, 10, 7, 9]; // Mar, Apr, May, Jun, Jul
  for (let i = 0; i < 5; i++) {
    const month = 3 + i; // March = 3
    const year = 2026;
    const count = monthlyCounts[i];
    const appts = generateMonthAppointments(year, month, count, serviceIds, [], usedClients);
    allAppts.push(...appts);
  }

  // Also add a few for Feb 2026
  const febAppts = generateMonthAppointments(2026, 2, 5, serviceIds, [], usedClients);
  allAppts.push(...febAppts);

  console.log(`Generating ${allAppts.length} appointments...`);

  let createdCount = 0;
  for (const a of allAppts) {
    const appt = await prisma.appointment.create({
      data: {
        clientName: a.client.name,
        clientEmail: a.client.email,
        clientPhone: a.client.phone,
        serviceType: a.serviceType,
        appointmentDate: a.date,
        appointmentTime: a.time,
        duration: a.duration,
        status: a.status as any,
        locationType: a.locationType as any,
        district: a.district,
        address: a.address,
        addressReference: a.addressReference,
        servicePrice: a.servicePrice,
        totalPrice: a.totalPrice,
        transportCost: a.transportCost,
        nightShiftCost: a.nightShiftCost,
        services: a.services as any,
        totalDuration: a.totalDuration,
        additionalNotes: a.notes,
      },
    });

    // Create review for COMPLETED appointments (about 70% of completed)
    if (a.status === "COMPLETED" && Math.random() > 0.3) {
      const reviewText = pick(REVIEW_TEXTS);
      const reviewerIdx = randomInt(0, REVIEW_NAMES_RESPONSES.length - 1);
      const reviewResponse = REVIEW_NAMES_RESPONSES[reviewerIdx];

      await prisma.review.create({
        data: {
          appointmentId: appt.id,
          reviewToken: randomUUID(),
          reviewerName: a.client.name.split(" ")[0],
          reviewerEmail: a.client.email,
          rating: randomInt(4, 5),
          reviewText,
          isPublic: true,
          status: "APPROVED",
          adminResponse: reviewResponse.response,
          respondedAt: new Date(a.date.getTime() + 86400000 * randomInt(1, 5)),
        },
      });
    }

    // Create finance entry for every COMPLETED appointment
    if (a.status === "COMPLETED" && a.totalPrice && a.totalPrice > 0) {
      const entryDate = new Date(a.date);
      const entries: any[] = [{
        entryDate,
        type: "INCOME",
        amount: a.servicePrice || a.totalPrice,
        category: a.serviceType,
        serviceLine: "GENERAL",
        paymentMethod: pick(["YAPE", "PLIN", "TRANSFER", "CASH"]),
        source: "APPOINTMENT",
        note: `Cita: ${appt.id} - ${a.client.name}`,
      }];

      if (a.transportCost && a.transportCost > 0) {
        entries.push({
          entryDate,
          type: "EXPENSE",
          amount: a.transportCost,
          category: "Transporte",
          serviceLine: "GENERAL",
          paymentMethod: "CASH",
          source: "APPOINTMENT",
          note: `Cita: ${appt.id} - Transporte`,
        });
      }

      if (a.nightShiftCost && a.nightShiftCost > 0) {
        entries.push({
          entryDate,
          type: "EXPENSE",
          amount: a.nightShiftCost,
          category: "Recargo nocturno",
          serviceLine: "GENERAL",
          paymentMethod: "CASH",
          source: "APPOINTMENT",
          note: `Cita: ${appt.id} - Recargo nocturno`,
        });
      }

      await prisma.financeEntry.createMany({ data: entries as any });
    }

    createdCount++;
    if (createdCount % 15 === 0) console.log(`  ${createdCount}/${allAppts.length}`);
  }

  console.log(`\nCreated ${createdCount} appointments with reviews and finance entries.`);

  // Summary by month
  const summary = await prisma.$queryRaw`
    SELECT 
      to_char("appointmentDate", 'YYYY-MM') as month,
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed,
      COUNT(*) FILTER (WHERE status = 'CANCELLED') as cancelled,
      SUM("totalPrice") FILTER (WHERE status = 'COMPLETED') as revenue
    FROM appointments
    GROUP BY month
    ORDER BY month
  `;
  console.log("\n=== MONTHLY SUMMARY ===");
  console.log(summary);

  console.log("\n✅ Seed complete! Version: 1.9.9");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
