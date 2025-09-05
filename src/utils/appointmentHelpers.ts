import { Appointment } from "@/hooks/useAppointments";
import { formatDateForDisplay, formatTimeRange } from "@/utils/dateUtils";

export const getStatusColor = (status: Appointment["status"]) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CONFIRMED":
      return "bg-green-100 text-green-800";
    case "COMPLETED":
      return "bg-blue-100 text-blue-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: Appointment["status"]) => {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "CONFIRMED":
      return "Confirmada";
    case "COMPLETED":
      return "Completada";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
};

export const formatServices = (appointment: Appointment) => {
  if (appointment.services && Array.isArray(appointment.services) && appointment.services.length > 0) {
    return appointment.services.map(service => ({
      name: service.name,
      quantity: service.quantity,
      displayText: service.quantity > 1 ? `${service.name} x${service.quantity}` : service.name
    }));
  }
  
  return [{
    name: appointment.serviceType,
    quantity: 1,
    displayText: appointment.serviceType
  }];
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return formatDateForDisplay(date);
};

export const formatTime = (timeString: string) => {
  return formatTimeRange(timeString);
};

export const scrollToAppointment = (appointmentId: string) => {
  setTimeout(() => {
    const element = document.getElementById(`appointment-${appointmentId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
};

export const formatPrice = (price?: number) => {
  if (price === undefined || price === null) {
    return "No definido";
  }
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(price);
};

export const getPriceBreakdown = (appointment: Appointment) => {
  const servicePrice = appointment.servicePrice || 0;
  const transportCost = appointment.transportCost || 0;
  const nightShiftCost = appointment.nightShiftCost || 0;
  const totalPrice =
    appointment.totalPrice !== null && appointment.totalPrice !== undefined
      ? appointment.totalPrice
      : servicePrice + transportCost + nightShiftCost;

  return {
    servicePrice,
    transportCost,
    nightShiftCost,
    totalPrice,
    hasTransport: transportCost > 0,
    hasNightShift: nightShiftCost > 0,
  };
};
