import { parseAppointmentTime } from "./dateRange";
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    id: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    service: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    notes?: string;
    price: number;
  };
}

export type Appointment = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  status: string;
  additionalNotes?: string;
  servicePrice?: number;
  transportCost?: number;
  totalPrice?: number;
  duration?: number;
};

export function mapAppointmentsToEvents(
  appointments: Appointment[],
): CalendarEvent[] {
  return appointments
    .map((appointment) => {
      try {
        const { start, end } = parseAppointmentTime(
          appointment.appointmentDate,
          appointment.appointmentTime,
          appointment.duration,
        );
        const serviceType =
          appointment.serviceType || "Servicio no especificado";

        return {
          id: appointment.id,
          title: `${appointment.clientName} - ${serviceType}`,
          start,
          end,
          resource: {
            id: appointment.id,
            clientName: appointment.clientName,
            clientEmail: appointment.clientEmail,
            clientPhone: appointment.clientPhone,
            service: serviceType,
            status: appointment.status as
              | "PENDING"
              | "CONFIRMED"
              | "COMPLETED"
              | "CANCELLED",
            notes: appointment.additionalNotes,
            price: appointment.totalPrice || appointment.servicePrice || 0,
          },
        };
      } catch (error) {
        console.error(`Error processing appointment ${appointment.id}:`, error);
        return null;
      }
    })
    .filter(Boolean) as CalendarEvent[];
}
