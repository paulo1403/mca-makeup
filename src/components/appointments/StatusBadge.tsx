import type { Appointment } from "@/hooks/useAppointments";
import React from "react";

const STATUS_LABELS: Record<Appointment["status"], string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

export default function StatusBadge({
  status,
  className = "",
}: {
  status: Appointment["status"];
  className?: string;
}) {
  const key = status.toLowerCase();
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${className}`}
      style={{
        backgroundColor: `var(--status-${key}-bg)`,
        color: `var(--status-${key}-text)`,
        borderColor: `var(--status-${key}-border)`,
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
