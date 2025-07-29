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
