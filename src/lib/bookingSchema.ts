import { z } from 'zod'

const ServiceItemSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1, 'La cantidad debe ser al menos 1.'),
})

export const BookingSchema = z.object({
  name: z.string().min(2, 'Nombre requerido.').max(100),
  phone: z
    .string()
    .regex(/^(\+51)?\s?(\d{3})\s?(\d{3})\s?(\d{3})$/, 'Formato de teléfono no válido.')
    .min(9, 'Teléfono requerido.'),
  email: z.string().email('Email inválido.'),

  selectedServices: z.array(ServiceItemSchema).min(1, 'Selecciona al menos un servicio.'),

  locationType: z.enum(['STUDIO', 'HOME'], { message: 'Selecciona la ubicación.' }),
  district: z.string().max(50).optional(),
  address: z.string().max(255).optional(),
  addressReference: z.string().max(255).optional(),

  date: z.date({ required_error: 'Fecha requerida.' }),
  timeSlot: z.string().min(1, 'Horario requerido.'),

  message: z.string().max(500).optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, 'Debes aceptar los términos.'),
})

export type BookingData = z.infer<typeof BookingSchema>

export default BookingSchema
