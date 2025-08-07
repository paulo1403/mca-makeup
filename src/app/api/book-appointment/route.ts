import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";
import { sendEmail, emailTemplates } from "@/lib/email";
import {
  parseDateFromString,
  formatDateForDisplay,
  formatTimeRange,
  debugDate,
} from "@/utils/dateUtils";

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
        // Remover espacios, guiones y símbolos para validar solo números
        const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, "");
        // Aceptar teléfonos peruanos: 9 dígitos o con código de país (11-12 dígitos)
        return (
          cleanPhone.length >= 9 &&
          cleanPhone.length <= 12 &&
          /^\d+$/.test(cleanPhone)
        );
      }, "Formato de teléfono inválido. Ej: +51 999 209 880 o 999209880"),
    services: z
      .array(z.string().min(1, "Servicio inválido"))
      .min(1, "Debe seleccionar al menos un servicio"),
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
      // Si es a domicilio, distrito y dirección son requeridos
      if (data.locationType === "HOME") {
        return (
          data.district &&
          data.district.length > 0 &&
          data.address &&
          data.address.length > 0
        );
      }
      return true;
    },
    {
      message:
        "Para servicios a domicilio, distrito y dirección son requeridos",
      path: ["address"],
    },
  )
  .refine(
    (data) => {
      // Validar combinaciones de servicios permitidas
      if (data.services.length === 0) return true;

      // Obtener servicios desde la base de datos para validar categorías
      // Esta validación se hará en el endpoint después de parsear los servicios
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

    // Validate input
    const validatedData = appointmentSchema.parse(body);

    // Parse and validate services
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

    for (const serviceString of validatedData.services) {
      // Extract service name from string (formato: "Nombre (S/ 200)")
      let serviceName = serviceString;
      if (serviceString.includes("(S/")) {
        serviceName = serviceString.split(" (S/")[0].trim();
      }

      // Find matching service in database
      const matchedService = allServices.find(
        (s) =>
          s.name === serviceName ||
          s.name.toLowerCase().includes(serviceName.toLowerCase()) ||
          serviceName.toLowerCase().includes(s.name.toLowerCase()),
      );

      if (!matchedService) {
        return NextResponse.json(
          { error: `Servicio no encontrado: ${serviceName}` },
          { status: 400 },
        );
      }

      parsedServices.push(matchedService);
      totalDuration += matchedService.duration;
      calculatedServicePrice += matchedService.price;
    }

    // Validar combinaciones de servicios
    const categories = parsedServices.map((s) => s.category);
    const uniqueCategories = [...new Set(categories)];

    // No permitir solo peinado
    if (uniqueCategories.length === 1 && uniqueCategories[0] === "HAIRSTYLE") {
      return NextResponse.json(
        {
          error:
            "No se puede reservar solo peinado. Debe incluir un servicio de maquillaje.",
        },
        { status: 400 },
      );
    }

    // No permitir combinar novia con social/piel madura
    const hasNovia = categories.includes("BRIDAL");
    const hasSocial =
      categories.includes("SOCIAL") || categories.includes("MATURE_SKIN");

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
      return NextResponse.json(
        { error: "Formato de fecha inválido" },
        { status: 400 },
      );
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
        totalPrice = calculatedServicePrice + transportCost;
      }
    }

    // Crear string de servicios para serviceType (mantener compatibilidad)
    const serviceTypeString = parsedServices.map((s) => s.name).join(" + ");

    // Crear objeto de servicios para almacenar en JSON
    const servicesJson = parsedServices.map((s) => ({
      id: s.id,
      name: s.name,
      price: s.price,
      duration: s.duration,
      category: s.category,
    }));

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
        totalPrice: totalPrice,
        duration: totalDuration,
        totalDuration: totalDuration,
        appointmentDate: appointmentDateTime,
        appointmentTime: validatedData.appointmentTimeRange,
        locationType: validatedData.locationType,
        district:
          validatedData.locationType === "HOME" ? validatedData.district : null,
        address:
          validatedData.locationType === "HOME" ? validatedData.address : null,
        addressReference:
          validatedData.locationType === "HOME"
            ? validatedData.addressReference
            : null,
        additionalNotes: `Servicios: ${serviceTypeString}\nUbicación: ${validatedData.locationType === "STUDIO" ? "Local en Pueblo Libre" : `Domicilio - ${validatedData.district || ""}, ${validatedData.address || ""}`}${validatedData.addressReference ? ` (Ref: ${validatedData.addressReference})` : ""}${validatedData.additionalNotes ? `\n\nNotas adicionales: ${validatedData.additionalNotes}` : ""}`,
        status: "CONFIRMED",
      },
    });

    // Create notification for the admin
    const formatDate = (date: Date) => {
      return formatDateForDisplay(date);
    };

    const formatTime = (time: string) => {
      return formatTimeRange(time);
    };

    await prisma.notification.create({
      data: {
        type: "APPOINTMENT",
        title: "Nueva cita confirmada",
        message: `${appointment.clientName} ha reservado ${serviceTypeString} para el ${formatDate(appointment.appointmentDate)} a las ${formatTime(appointment.appointmentTime)}`,
        link: "/admin/appointments",
        appointmentId: appointment.id,
        read: false,
      },
    });

    // Send notification emails
    try {
      // Send notification to admin/Marcela
      if (process.env.ADMIN_EMAIL) {
        const adminEmailData = emailTemplates.newAppointmentAlert(
          appointment.clientName,
          serviceTypeString,
          formatDate(appointment.appointmentDate),
          formatTime(appointment.appointmentTime),
          appointment.clientEmail,
          appointment.clientPhone,
          validatedData.locationType,
          validatedData.district,
          validatedData.address,
          validatedData.addressReference,
          validatedData.additionalNotes,
        );

        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: adminEmailData.subject,
          html: adminEmailData.html,
          text: adminEmailData.text,
        });
      }

      // Send confirmation to client
      // Send confirmation to client immediately since appointment is auto-confirmed
      const clientEmailData = emailTemplates.appointmentConfirmed(
        appointment.clientName,
        serviceTypeString,
        formatDate(appointment.appointmentDate),
        formatTime(appointment.appointmentTime),
        validatedData.locationType,
        validatedData.district,
        validatedData.address,
        validatedData.addressReference,
        validatedData.additionalNotes,
      );

      await sendEmail({
        to: appointment.clientEmail,
        subject: clientEmailData.subject,
        html: clientEmailData.html,
        text: clientEmailData.text,
      });
      console.log("Email notifications sent successfully");
    } catch (emailError) {
      console.error("Error sending email notifications:", emailError);
      // No fallar la operación si el email falla
    }

    return NextResponse.json(
      {
        message: "Cita confirmada exitosamente",
        appointmentId: appointment.id,
        pricing: {
          servicePrice: calculatedServicePrice,
          transportCost: transportCost,
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
      const phoneError = error.errors.find((err) =>
        err.path.includes("clientPhone"),
      );

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
          message:
            "Por favor verifica que todos los campos estén completos y sean válidos.",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
