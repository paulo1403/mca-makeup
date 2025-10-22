import type { RecentAppointment } from "@/hooks/useRecentAppointments";
import { formatDateForDashboard, formatTimeRange } from "@/utils/dateUtils";

export const formatServices = (appointment: RecentAppointment) => {
  // Si hay datos de services con cantidades, usar esos
  if (
    appointment.services &&
    Array.isArray(appointment.services) &&
    appointment.services.length > 0
  ) {
    return appointment.services.map((service) => ({
      name: service.name || service.serviceName || "",
      quantity: service.quantity || 1,
      displayText:
        service.quantity && service.quantity > 1
          ? `${service.name || service.serviceName} x${service.quantity}`
          : service.name || service.serviceName,
    }));
  }

  // Fallback al serviceType string
  return [
    {
      name: appointment.serviceType,
      quantity: 1,
      displayText: appointment.serviceType,
    },
  ];
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    // Use the short date format for dashboard display
    return formatDateForDashboard(date);
  } catch {
    return "Fecha inválida";
  }
};

export const formatTime = (timeString: string): string => {
  try {
    // Si es un rango de tiempo (ej: "15:00 - 16:00"), usar formatTimeRange
    if (timeString.includes(" - ")) {
      return formatTimeRange(timeString);
    }

    // Si es solo una hora (ej: "15:00"), formatear normalmente
    const date = new Date(`1970-01-01T${timeString}`);
    if (Number.isNaN(date.getTime())) {
      return timeString; // Retornar el string original si no se puede parsear
    }

    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return timeString; // Retornar el string original en caso de error
  }
};

export const formatDateTime = (dateString: string, timeString: string): string => {
  const formattedDate = formatDate(dateString);
  const formattedTime = formatTime(timeString);
  return `${formattedDate} • ${formattedTime}`;
};

export const getStatusColor = (status: RecentAppointment["status"]): string => {
  const statusColors = {
    PENDING:
      "bg-[color:var(--status-pending-bg)] text-[color:var(--status-pending-text)] border-[color:var(--status-pending-border)]",
    CONFIRMED:
      "bg-[color:var(--status-confirmed-bg)] text-[color:var(--status-confirmed-text)] border-[color:var(--status-confirmed-border)]",
    COMPLETED:
      "bg-[color:var(--status-completed-bg)] text-[color:var(--status-completed-text)] border-[color:var(--status-completed-border)]",
    CANCELLED:
      "bg-[color:var(--status-cancelled-bg)] text-[color:var(--status-cancelled-text)] border-[color:var(--status-cancelled-border)]",
  } as const;

  return (
    statusColors[status] ||
    "bg-[color:var(--color-surface-elevated)] text-[color:var(--color-heading)] border-[color:var(--color-border)]/40"
  );
};

export const getStatusText = (status: RecentAppointment["status"]): string => {
  const statusTexts = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmada",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada",
  };

  return statusTexts[status] || status;
};

export const getClientInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
