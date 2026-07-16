import type { Appointment } from "@/hooks/useAppointments";

const STATUS_CONFIG: Record<
  Appointment["status"],
  { label: string; bg: string; text: string }
> = {
  PENDING: {
    label: "Pendiente",
    bg: "bg-[color:var(--color-warning)]/10",
    text: "text-[color:var(--color-warning)]",
  },
  CONFIRMED: {
    label: "Confirmada",
    bg: "bg-[color:var(--color-success)]/10",
    text: "text-[color:var(--color-success)]",
  },
  COMPLETED: {
    label: "Completada",
    bg: "bg-[color:var(--color-primary)]/10",
    text: "text-[color:var(--color-primary)]",
  },
  CANCELLED: {
    label: "Cancelada",
    bg: "bg-[color:var(--color-muted)]/10",
    text: "text-[color:var(--color-muted)]",
  },
};

export default function StatusBadge({
  status,
  className = "",
}: {
  status: Appointment["status"];
  className?: string;
}) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${cfg.bg} ${cfg.text} ${className}`}
    >
      {cfg.label}
    </span>
  );
}
