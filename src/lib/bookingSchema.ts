import { z } from "zod";

const ServiceItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1, "La cantidad debe ser al menos 1."),
});

export const BookingSchema = z.object({
  name: z.string().min(2, "Nombre requerido.").max(100),
  country: z.enum(["PE", "OTHER"]),
  phone: z.string().min(1, "Teléfono requerido."),
  email: z.string().email("Email inválido."),

  documentNumber: z.string().optional(),

  selectedServices: z.array(ServiceItemSchema).min(1, "Selecciona al menos un servicio."),

  locationType: z.enum(["STUDIO", "HOME"], { message: "Selecciona la ubicación." }),
  district: z.string().max(50).optional(),
  address: z.string().max(255).optional(),
  addressReference: z.string().max(255).optional(),

  date: z.date({ error: "Fecha requerida." }),
  timeSlot: z.string().min(1, "Horario requerido."),

  message: z.string().max(500).optional(),
  additionalNotes: z.string().max(500).optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, "Debes aceptar los términos."),
}).refine(
  (data) => {
    if (data.country === "PE") {
      return data.documentNumber && /^\d{8}$/.test(data.documentNumber);
    }
    return true;
  },
  {
    message: "DNI debe tener exactamente 8 dígitos.",
    path: ["documentNumber"],
  },
).refine(
  (data) => {
    if (data.country === "PE") {
      const clean = data.phone.replace(/[\s\-+()]/g, "");
      return clean.length >= 9 && clean.length <= 12 && /^\d+$/.test(clean);
    }
    return data.phone.length >= 6;
  },
  {
    message: "Formato de teléfono inválido.",
    path: ["phone"],
  },
);

export type BookingData = z.infer<typeof BookingSchema>;

export default BookingSchema;
