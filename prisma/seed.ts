import fs from "fs";
import dotenv from "dotenv";

if (fs.existsSync(".env.development")) {
  dotenv.config({ path: ".env.development" });
} else {
  dotenv.config();
}

import { LocationType, NotificationType, PrismaClient, ServiceCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // 1. Servicios de Maquillaje
  console.log("📋 Creando servicios...");
  const services = [
    {
      name: "Maquillaje de Novia",
      description:
        "Maquillaje profesional para el día más importante de tu vida. Incluye prueba previa y retoque.",
      price: 350.0,
      duration: 180,
      category: ServiceCategory.BRIDAL,
    },
    {
      name: "Maquillaje Social",
      description: "Perfecto para eventos sociales, fiestas y ocasiones especiales.",
      price: 180.0,
      duration: 120,
      category: ServiceCategory.SOCIAL,
    },
    {
      name: "Maquillaje para Piel Madura",
      description: "Técnicas especializadas para resaltar la belleza natural en pieles maduras.",
      price: 200.0,
      duration: 135,
      category: ServiceCategory.MATURE_SKIN,
    },
    {
      name: "Peinado Simple",
      description: "Peinado elegante y duradero para complementar tu look.",
      price: 100.0,
      duration: 60,
      category: ServiceCategory.HAIRSTYLE,
    },
    {
      name: "Peinado de Novia",
      description: "Peinado sofisticado para novias, incluye accesorios y prueba previa.",
      price: 180.0,
      duration: 120,
      category: ServiceCategory.BRIDAL,
    },
    {
      name: "Maquillaje + Peinado Novia",
      description: "Paquete completo para novias: maquillaje profesional + peinado elegante.",
      price: 480.0,
      duration: 240,
      category: ServiceCategory.BRIDAL,
    },
    {
      name: "Maquillaje + Peinado Social",
      description: "Combo perfecto para eventos: maquillaje y peinado coordinados.",
      price: 250.0,
      duration: 180,
      category: ServiceCategory.SOCIAL,
    },
    {
      name: "Maquillaje Express",
      description: "Maquillaje rápido y natural para el día a día o eventos casuales.",
      price: 120.0,
      duration: 75,
      category: ServiceCategory.OTHER,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: service,
      create: service,
    });
  }

  // 2. Costos de Transporte por Distrito
  console.log("🚗 Creando costos de transporte...");
  const transportCosts = [
    { district: "Pueblo Libre", cost: 0.0, notes: "Ubicación del estudio" },
    { district: "Magdalena del Mar", cost: 15.0 },
    { district: "San Miguel", cost: 15.0 },
    { district: "Jesús María", cost: 20.0 },
    { district: "Lince", cost: 20.0 },
    { district: "Breña", cost: 20.0 },
    { district: "Lima Cercado", cost: 25.0 },
    { district: "La Victoria", cost: 25.0 },
    { district: "Miraflores", cost: 30.0 },
    { district: "San Isidro", cost: 30.0 },
    { district: "Barranco", cost: 35.0 },
    { district: "Chorrillos", cost: 40.0 },
    { district: "Surco", cost: 45.0 },
    { district: "La Molina", cost: 50.0 },
    { district: "San Borja", cost: 35.0 },
    { district: "Surquillo", cost: 30.0 },
    { district: "Callao", cost: 40.0 },
    { district: "Bellavista", cost: 45.0 },
    { district: "La Perla", cost: 45.0 },
    { district: "Ventanilla", cost: 60.0 },
    { district: "Los Olivos", cost: 45.0 },
    { district: "San Martín de Porres", cost: 40.0 },
    { district: "Independencia", cost: 45.0 },
    { district: "Comas", cost: 50.0 },
    { district: "Carabayllo", cost: 55.0 },
    { district: "Puente Piedra", cost: 60.0 },
    { district: "Santa Anita", cost: 40.0 },
    { district: "El Agustino", cost: 35.0 },
    { district: "San Luis", cost: 35.0 },
    { district: "Ate", cost: 45.0 },
  ];

  for (const transport of transportCosts) {
    await prisma.transportCost.upsert({
      where: { district: transport.district },
      update: transport,
      create: transport,
    });
  }

  // 3. Disponibilidad Regular (Horarios de trabajo)
  console.log("📅 Creando disponibilidad regular...");
  const regularAvailability = [
    // Martes - STUDIO
    {
      dayOfWeek: 2,
      startTime: "09:00",
      endTime: "13:00",
      locationType: LocationType.STUDIO,
    },
    {
      dayOfWeek: 2,
      startTime: "14:00",
      endTime: "18:00",
      locationType: LocationType.STUDIO,
    },
    // Martes - HOME
    {
      dayOfWeek: 2,
      startTime: "08:00",
      endTime: "12:00",
      locationType: LocationType.HOME,
    },
    {
      dayOfWeek: 2,
      startTime: "15:00",
      endTime: "19:00",
      locationType: LocationType.HOME,
    },

    // Miércoles - STUDIO
    {
      dayOfWeek: 3,
      startTime: "09:00",
      endTime: "13:00",
      locationType: LocationType.STUDIO,
    },
    {
      dayOfWeek: 3,
      startTime: "14:00",
      endTime: "18:00",
      locationType: LocationType.STUDIO,
    },
    // Miércoles - HOME
    {
      dayOfWeek: 3,
      startTime: "08:00",
      endTime: "12:00",
      locationType: LocationType.HOME,
    },
    {
      dayOfWeek: 3,
      startTime: "15:00",
      endTime: "19:00",
      locationType: LocationType.HOME,
    },

    // Jueves - STUDIO
    {
      dayOfWeek: 4,
      startTime: "09:00",
      endTime: "13:00",
      locationType: LocationType.STUDIO,
    },
    {
      dayOfWeek: 4,
      startTime: "14:00",
      endTime: "18:00",
      locationType: LocationType.STUDIO,
    },
    // Jueves - HOME
    {
      dayOfWeek: 4,
      startTime: "08:00",
      endTime: "12:00",
      locationType: LocationType.HOME,
    },
    {
      dayOfWeek: 4,
      startTime: "15:00",
      endTime: "19:00",
      locationType: LocationType.HOME,
    },

    // Viernes - STUDIO
    {
      dayOfWeek: 5,
      startTime: "09:00",
      endTime: "13:00",
      locationType: LocationType.STUDIO,
    },
    {
      dayOfWeek: 5,
      startTime: "14:00",
      endTime: "18:00",
      locationType: LocationType.STUDIO,
    },
    // Viernes - HOME
    {
      dayOfWeek: 5,
      startTime: "08:00",
      endTime: "12:00",
      locationType: LocationType.HOME,
    },
    {
      dayOfWeek: 5,
      startTime: "15:00",
      endTime: "19:00",
      locationType: LocationType.HOME,
    },

    // Sábado - STUDIO (horario extendido)
    {
      dayOfWeek: 6,
      startTime: "08:00",
      endTime: "12:00",
      locationType: LocationType.STUDIO,
    },
    {
      dayOfWeek: 6,
      startTime: "13:00",
      endTime: "17:00",
      locationType: LocationType.STUDIO,
    },
    {
      dayOfWeek: 6,
      startTime: "18:00",
      endTime: "21:00",
      locationType: LocationType.STUDIO,
    },
    // Sábado - HOME (horario extendido)
    {
      dayOfWeek: 6,
      startTime: "07:00",
      endTime: "11:00",
      locationType: LocationType.HOME,
    },
    {
      dayOfWeek: 6,
      startTime: "14:00",
      endTime: "18:00",
      locationType: LocationType.HOME,
    },
    {
      dayOfWeek: 6,
      startTime: "19:00",
      endTime: "22:00",
      locationType: LocationType.HOME,
    },

    // Domingo - Solo HOME (eventos especiales)
    {
      dayOfWeek: 0,
      startTime: "08:00",
      endTime: "12:00",
      locationType: LocationType.HOME,
    },
    {
      dayOfWeek: 0,
      startTime: "15:00",
      endTime: "19:00",
      locationType: LocationType.HOME,
    },
  ];

  for (const availability of regularAvailability) {
    try {
      await prisma.regularAvailability.upsert({
        where: {
          dayOfWeek_startTime_endTime_locationType: {
            dayOfWeek: availability.dayOfWeek,
            startTime: availability.startTime,
            endTime: availability.endTime,
            locationType: availability.locationType as "STUDIO" | "HOME",
          },
        },
        update: availability,
        create: availability,
      });
    } catch {
      console.log(
        `Horario ya existe: ${availability.dayOfWeek} ${availability.startTime}-${availability.endTime} ${availability.locationType}`,
      );
    }
  }

  // 4. Fechas Especiales
  console.log("🎯 Creando fechas especiales...");
  const today = new Date();
  const currentYear = today.getFullYear();

  const specialDates = [
    // Días festivos - No disponible
    {
      date: new Date(currentYear, 0, 1), // Año Nuevo
      isAvailable: false,
      note: "Año Nuevo - Día festivo",
    },
    {
      date: new Date(currentYear, 11, 25), // Navidad
      isAvailable: false,
      note: "Navidad - Día festivo",
    },
    {
      date: new Date(currentYear, 6, 28), // Fiestas Patrias
      isAvailable: false,
      note: "Fiestas Patrias",
    },
    {
      date: new Date(currentYear, 6, 29), // Fiestas Patrias
      isAvailable: false,
      note: "Fiestas Patrias",
    },

    // Días con horario especial
    {
      date: new Date(currentYear, 1, 14), // San Valentín
      isAvailable: true,
      startTime: "07:00",
      endTime: "22:00",
      note: "San Valentín - Horario extendido",
    },
    {
      date: new Date(currentYear, 4, 10), // Día de la Madre
      isAvailable: true,
      startTime: "07:00",
      endTime: "21:00",
      note: "Día de la Madre - Horario extendido",
    },
    {
      date: new Date(currentYear, 11, 31), // Año Nuevo
      isAvailable: true,
      startTime: "10:00",
      endTime: "20:00",
      note: "Víspera de Año Nuevo - Horario especial",
    },
  ];

  for (const specialDate of specialDates) {
    await prisma.specialDate.upsert({
      where: { date: specialDate.date },
      update: specialDate,
      create: specialDate,
    });
  }

  // 5. Configuraciones del Sistema
  console.log("⚙️ Creando configuraciones del sistema...");
  const systemSettings = [
    {
      key: "business_name",
      value: "Marcela Cordero Makeup",
      description: "Nombre del negocio",
    },
    {
      key: "business_email",
      value: "marcela@marcelacorderomakeup.com",
      description: "Email principal del negocio",
    },
    {
      key: "business_phone",
      value: "+51 999 123 456",
      description: "Teléfono principal del negocio",
    },
    {
      key: "studio_address",
      value: "Av. Bolívar 1073, Pueblo Libre, Lima",
      description: "Dirección del estudio",
    },
    {
      key: "booking_advance_days",
      value: "3",
      description: "Días mínimos de anticipación para reservas",
    },
    {
      key: "max_booking_days",
      value: "90",
      description: "Días máximos de anticipación para reservas",
    },
    {
      key: "default_appointment_duration",
      value: "120",
      description: "Duración por defecto de citas en minutos",
    },
    {
      key: "cancellation_hours",
      value: "24",
      description: "Horas mínimas para cancelar una cita",
    },
    {
      key: "instagram_url",
      value: "https://instagram.com/marcelacorderomakeup",
      description: "URL de Instagram",
    },
    {
      key: "facebook_url",
      value: "https://facebook.com/marcelacorderomakeup",
      description: "URL de Facebook",
    },
    {
      key: "whatsapp_number",
      value: "+51999123456",
      description: "Número de WhatsApp",
    },
    {
      key: "auto_confirm_appointments",
      value: "false",
      description: "Confirmar citas automáticamente",
    },
    {
      key: "reminder_hours_before",
      value: "24",
      description: "Horas antes de la cita para enviar recordatorio",
    },
    {
      key: "studio_capacity",
      value: "1",
      description: "Capacidad máxima del estudio (citas simultáneas)",
    },
    {
      key: "home_service_enabled",
      value: "true",
      description: "Habilitar servicio a domicilio",
    },
    {
      key: "studio_service_enabled",
      value: "true",
      description: "Habilitar servicio en estudio",
    },
  ];

  for (const setting of systemSettings) {
    await prisma.systemSettings.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  // 6. Disponibilidad específica para los próximos 30 días
  console.log("📆 Creando disponibilidad específica...");
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    // Solo agregar disponibilidad para días laborables (martes a domingo)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek >= 2 || dayOfWeek === 0) {
      // Martes (2) a Domingo (0)

      // Horarios de mañana
      const morningSlots = [
        { startTime: "09:00", endTime: "11:00" },
        { startTime: "11:30", endTime: "13:30" },
      ];

      // Horarios de tarde
      const afternoonSlots = [
        { startTime: "14:00", endTime: "16:00" },
        { startTime: "16:30", endTime: "18:30" },
      ];

      const allSlots = [...morningSlots, ...afternoonSlots];

      for (const slot of allSlots) {
        try {
          await prisma.availability.upsert({
            where: {
              date_startTime_endTime: {
                date: currentDate,
                startTime: slot.startTime,
                endTime: slot.endTime,
              },
            },
            update: {
              available: true,
              notes: `Disponible - ${currentDate.toLocaleDateString("es-PE")}`,
            },
            create: {
              date: currentDate,
              startTime: slot.startTime,
              endTime: slot.endTime,
              available: true,
              notes: `Disponible - ${currentDate.toLocaleDateString("es-PE")}`,
            },
          });
        } catch {
          // Slot ya existe, continuar
        }
      }
    }
  }

  // 7. Notificaciones del sistema
  console.log("🔔 Creando notificaciones del sistema...");
  const systemNotifications = [
    {
      type: NotificationType.SYSTEM,
      title: "Sistema Inicializado",
      message: "El sistema de reservas ha sido configurado correctamente con datos iniciales.",
      link: "/admin/dashboard",
      read: false,
    },
    {
      type: NotificationType.SYSTEM,
      title: "Servicios Configurados",
      message: "Se han agregado los servicios principales de maquillaje y peinado.",
      link: "/admin/services",
      read: false,
    },
    {
      type: NotificationType.SYSTEM,
      title: "Costos de Transporte",
      message: "Se han configurado los costos de transporte para todos los distritos de Lima.",
      link: "/admin/transport",
      read: false,
    },
  ];

  for (const notification of systemNotifications) {
    await prisma.notification.create({
      data: notification,
    });
  }

  console.log("✅ Seed completado exitosamente!");
  console.log("\n📊 Resumen de datos creados:");
  console.log(`   • ${services.length} servicios`);
  console.log(`   • ${transportCosts.length} costos de transporte`);
  console.log(`   • ${regularAvailability.length} horarios regulares`);
  console.log(`   • ${specialDates.length} fechas especiales`);
  console.log(`   • ${systemSettings.length} configuraciones`);
  console.log(`   • ~120 slots de disponibilidad (30 días)`);
  console.log(`   • ${systemNotifications.length} notificaciones`);
  console.log("\n🎉 La base de datos está lista para usar!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
