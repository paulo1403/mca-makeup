import { Badge } from "@/components/ui/badge";
import type { Appointment } from "@/hooks/useAppointments";

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
  return (
    <Badge variant="outline" className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
