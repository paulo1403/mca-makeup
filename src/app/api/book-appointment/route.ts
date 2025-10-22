import { emailTemplates, sendEmail, sendEmailToAdmins } from "@/lib/serverEmail";
import { debugDate, parseDateFromString } from "@/utils/dateUtils";
import { calculateNightShiftCost } from "@/utils/nightShift";
import { type Prisma, PrismaClient } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema
const appointmentSchema = z
  .object({
    clientName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    clientEmail: z.string().email("Email inválido"),
    clientPhone: z
      .string()
      .min(8, "Teléfono inválido")
      .max(20, "Teléfono muy largo")
      .refine((phone) => {
        const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, "");
        return cleanPhone.length >= 9 && cleanPhone.length <= 12 && /^\d+$/.test(cleanPhone);
      }, "Formato de teléfono inválido. Ej: +51 999 209 880 o 999209880"),
    services: z
      .record(z.string(), z.number().min(1))
      .refine((obj) => Object.keys(obj).length > 0, {
        message: "Debe seleccionar al menos un servicio",
      })
      .refine((obj) => Object.values(obj).some((quantity) => quantity > 0), {
        message: "Debe seleccionar al menos una cantidad de servicio",
      }),
    servicePrice: z.number().min(0, "Precio del servicio requerido"),
    appointmentDate: z.string().min(1, "Fecha requerida"),
    appointmentTimeRange: z.string().min(1, "Horario requerido"),
    locationType: z.enum(["STUDIO", "HOME"], {
      errorMap: () => ({ message: "Selecciona una ubicación válida" }),
    }),
    district: z.string().optional(),
    address: z.string().optional(),
    addressReference: z.string().optional(),
    additionalNotes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.locationType === "HOME") {
        return data.district && data.district.length > 0 && data.address && data.address.length > 0;
      }
      return true;
    },
    {
      message: "Para servicios a domicilio, distrito y dirección son requeridos",
      path: ["address"],
    },
  )
  .refine(
    (data) => {
      if (data.services.length === 0) return true;
      return true;
    },
    {
      message: "Combinación de servicios no válida",
      path: ["services"],
    },
  );

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = appointmentSchema.parse(body);

    const allServices = await prisma.service.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        duration: true,
        category: true,
      },
    });

    const parsedServices = [];
    let totalDuration = 0;
    let calculatedServicePrice = 0;

    for (const [serviceId, quantity] of Object.entries(validatedData.services)) {
      if (quantity <= 0) continue;

      const matchedService = allServices.find((s) => s.id === serviceId);

      if (!matchedService) {
        return NextResponse.json(
          { error: `Servicio no encontrado: ${serviceId}` },
          { status: 400 },
        );
      }

      for (let i = 0; i < quantity; i++) {
        parsedServices.push(matchedService);
      }

      totalDuration += matchedService.duration * quantity;
      calculatedServicePrice += matchedService.price * quantity;
    }

    const categories = parsedServices.map((s) => s.category);
    const uniqueCategories = [...new Set(categories)];

    if (uniqueCategories.length === 1 && uniqueCategories[0] === "HAIRSTYLE") {
      return NextResponse.json(
        {
          error: "No se puede reservar solo peinado. Debe incluir un servicio de maquillaje.",
        },
        { status: 400 },
      );
    }

    // No permitir combinar novia con social/piel madura
    const hasNovia = categories.includes("BRIDAL");
    const hasSocial = categories.includes("SOCIAL") || categories.includes("MATURE_SKIN");

    if (hasNovia && hasSocial) {
      return NextResponse.json(
        {
          error:
            "No se pueden combinar servicios de novia con servicios sociales o de piel madura.",
        },
        { status: 400 },
      );
    }

    // Solo permitir máximo 2 tipos de servicios
    if (uniqueCategories.length > 2) {
      return NextResponse.json(
        { error: "Solo se pueden combinar máximo 2 tipos de servicios." },
        { status: 400 },
      );
    }

    // Si hay 2 categorías, debe ser maquillaje + peinado
    if (uniqueCategories.length === 2) {
      const hasHairstyle = categories.includes("HAIRSTYLE");
      const hasMakeup =
        categories.includes("SOCIAL") ||
        categories.includes("MATURE_SKIN") ||
        categories.includes("BRIDAL");

      if (!(hasHairstyle && hasMakeup)) {
        return NextResponse.json(
          { error: "Solo se puede combinar maquillaje con peinado." },
          { status: 400 },
        );
      }
    }

    // Parse date correctly in Peru timezone
    let appointmentDateTime: Date;
    try {
      appointmentDateTime = parseDateFromString(validatedData.appointmentDate);
      debugDate(appointmentDateTime, "Parsed appointment date");
    } catch {
      return NextResponse.json({ error: "Formato de fecha inválido" }, { status: 400 });
    }

    // Check if the appointment slot (rango) is available
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        appointmentDate: appointmentDateTime,
        appointmentTime: validatedData.appointmentTimeRange,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "Este horario ya está ocupado. Por favor selecciona otro." },
        { status: 400 },
      );
    }

    // Calcular costo de transporte si es a domicilio
    let transportCost = 0;
    let totalPrice = calculatedServicePrice;

    // Calculate night shift cost
    const nightShiftCost = calculateNightShiftCost(validatedData.appointmentTimeRange);

    if (validatedData.locationType === "HOME" && validatedData.district) {
      const transportCostData = await prisma.transportCost.findFirst({
        where: {
          district: {
            equals: validatedData.district,
            mode: "insensitive",
          },
          isActive: true,
        },
      });

      if (transportCostData) {
        transportCost = transportCostData.cost;
        totalPrice = calculatedServicePrice + transportCost + nightShiftCost;
      }
    } else {
      totalPrice = calculatedServicePrice + nightShiftCost;
    }

    // Crear string de servicios para serviceType (mantener compatibilidad)
    const serviceTypeParts = [];
    const servicesJson = [];

    // Group services by their details and create summary
    const serviceGroups = new Map();

    for (const [serviceId, quantity] of Object.entries(validatedData.services)) {
      if (quantity <= 0) continue;

      const service = allServices.find((s) => s.id === serviceId);
      if (service) {
        const key = service.id;
        serviceGroups.set(key, {
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          category: service.category,
          quantity: quantity,
        });

        // Add to service type string
        if (quantity > 1) {
          serviceTypeParts.push(`${quantity}x ${service.name}`);
        } else {
          serviceTypeParts.push(service.name);
        }
      }
    }

    const serviceTypeString = serviceTypeParts.join(" + ");

    // Convert groups to final JSON format
    for (const serviceGroup of serviceGroups.values()) {
      servicesJson.push(serviceGroup);
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientName: validatedData.clientName,
        clientEmail: validatedData.clientEmail,
        clientPhone: validatedData.clientPhone,
        serviceType: serviceTypeString,
        services: servicesJson as Prisma.InputJsonValue,
        servicePrice: calculatedServicePrice,
        transportCost: transportCost > 0 ? transportCost : null,
        nightShiftCost: nightShiftCost > 0 ? nightShiftCost : null,
        totalPrice: totalPrice,
        duration: totalDuration,
        totalDuration: totalDuration,
        appointmentDate: appointmentDateTime,
        appointmentTime: validatedData.appointmentTimeRange,
        locationType: validatedData.locationType,
        district: validatedData.locationType === "HOME" ? validatedData.district : null,
        address: validatedData.locationType === "HOME" ? validatedData.address : null,
        addressReference:
          validatedData.locationType === "HOME" ? validatedData.addressReference : null,
        additionalNotes: `Servicios: ${serviceTypeString}\nUbicación: ${validatedData.locationType === "STUDIO" ? "Local en Av. Bolívar 1073, Pueblo Libre" : `Domicilio - ${validatedData.district || ""}, ${validatedData.address || ""}`}${validatedData.addressReference ? ` (Ref: ${validatedData.addressReference})` : ""}${validatedData.additionalNotes ? `\n\nNotas adicionales: ${validatedData.additionalNotes}` : ""}`,
        status: "PENDING",
      },
    });

    // Create notification for the admin
    await prisma.notification.create({
      data: {
        type: "APPOINTMENT",
        title: "Nueva cita pendiente",
        message: `${appointment.clientName} ha solicitado ${serviceTypeString} para el ${appointment.appointmentDate.toLocaleDateString("es-PE")} a las ${appointment.appointmentTime}`,
        link: "/admin/appointments",
        appointmentId: appointment.id,
        read: false,
      },
    });

    // Send email notification to admin/Marcela
    const adminEmailTemplate = emailTemplates.newAppointmentAlert(
      appointment.clientName,
      serviceTypeString,
      appointment.appointmentDate.toLocaleDateString("es-ES"),
      appointment.appointmentTime,
      appointment.clientEmail,
      appointment.clientPhone,
      appointment.locationType,
      appointment.district || undefined,
      appointment.address || undefined,
      appointment.addressReference || undefined,
      `Ubicación: ${appointment.locationType === "HOME" ? "Domicilio" : "Studio"}${appointment.district ? ` - Distrito: ${appointment.district}` : ""}${appointment.address ? ` - Dirección: ${appointment.address}` : ""}`,
    );

    const emailSent = await sendEmailToAdmins({
      subject: adminEmailTemplate.subject,
      html: adminEmailTemplate.html,
      text: adminEmailTemplate.text,
    });

    console.log("📧 Notificación admin enviada:", emailSent ? "✅ Exitosa" : "❌ Fallida");

    // Send confirmation email to client
    const clientEmailTemplate = emailTemplates.appointmentPending(
      appointment.clientName,
      serviceTypeString,
      appointment.appointmentDate.toLocaleDateString("es-ES"),
      appointment.appointmentTime,
      appointment.locationType,
      appointment.district || undefined,
      appointment.address || undefined,
      appointment.addressReference || undefined,
      appointment.additionalNotes || undefined,
    );

    const clientEmailSent = await sendEmail({
      to: appointment.clientEmail,
      subject: clientEmailTemplate.subject,
      html: clientEmailTemplate.html,
      text: clientEmailTemplate.text,
    });

    console.log("📧 Email cliente enviado:", clientEmailSent ? "✅ Exitosa" : "❌ Fallida");

    return NextResponse.json(
      {
        message: "Cita enviada exitosamente. Te contactaremos pronto para confirmar.",
        appointmentId: appointment.id,
        pricing: {
          servicePrice: calculatedServicePrice,
          transportCost: transportCost,
          nightShiftCost: nightShiftCost,
          totalPrice: totalPrice,
        },
        services: servicesJson,
        totalDuration: totalDuration,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating appointment:", error);

    if (error instanceof z.ZodError) {
      // Encontrar el primer error de teléfono para dar un mensaje más específico
      const phoneError = error.errors.find((err) => err.path.includes("clientPhone"));

      if (phoneError) {
        return NextResponse.json(
          {
            error: "Formato de teléfono inválido",
            message:
              "Por favor ingresa un número de teléfono válido. Ejemplos: +51 999 209 880 o 999 209 880",
            details: error.errors,
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          error: "Datos inválidos",
          message: "Por favor verifica que todos los campos estén completos y sean válidos.",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
