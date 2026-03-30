"use client";
import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Link,
  MapPin,
  RotateCcw,
  Star,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import StatusBadge from "@/components/appointments/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type Appointment,
  useDeleteAppointment,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import { useIsSmallMobile } from "@/hooks/useMediaQuery";
import {
  formatDate,
  formatPrice,
  formatServices,
  formatTime,
  getPriceBreakdown,
} from "@/utils/appointmentHelpers";
import { copyReviewLink } from "@/utils/reviewHelpers";

interface AppointmentTableProps {
  appointments: Appointment[];
  highlightedId?: string;
  onViewDetails: (appointment: Appointment) => void;
}

// Reusable icon button with tooltip
function ActionButton({
  tooltip,
  onClick,
  disabled,
  children,
}: {
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={tooltip}
            disabled={disabled}
            onClick={onClick}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

// Mobile Card Component
interface MobileAppointmentCardProps {
  appointment: Appointment;
  isHighlighted: boolean;
  onStatusUpdate: (id: string, status: Appointment["status"]) => void;
  onDelete: (id: string) => void;
  onViewDetails: (appointment: Appointment) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function MobileAppointmentCard({
  appointment,
  isHighlighted,
  onStatusUpdate,
  onDelete,
  onViewDetails,
  isUpdating,
  isDeleting,
}: MobileAppointmentCardProps) {
  const mobilePrimaryActionClass =
    "flex-1 bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)] border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-elevated)]";

  const priceInfo = getPriceBreakdown(appointment);
  const servicesLabel = formatServices(appointment)
    .map((s) => s.displayText)
    .join(", ");
  const isStudio = (appointment.location || "").toLowerCase().includes("studio");

  return (
    <div
      id={`appointment-${appointment.id}`}
      className={[
        "bg-[color:var(--color-surface)]",
        "rounded-xl",
        "border",
        "shadow-sm",
        "hover:shadow-md",
        "transition-all",
        "duration-200",
        "overflow-hidden",
        "mb-5",
        "last:mb-0",
        isHighlighted
          ? "border-[color:var(--color-primary)]/60 bg-[color:var(--color-primary)]/10 ring-2 ring-[color:var(--color-primary)]/40"
          : "border-transparent sm:border-[color:var(--color-border)]/40",
      ].join(" ")}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b bg-[color:var(--color-surface-elevated)] rounded-t-xl ${
          isHighlighted
            ? "border-[color:var(--color-primary)]/40"
            : "border-transparent sm:border-[color:var(--color-border)]/40"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start space-x-2 min-w-0">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] text-xs font-semibold ring-1 ring-[color:var(--color-border)]">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-semibold text-[color:var(--color-heading)] text-sm leading-tight">
                <span className="block truncate text-base font-semibold max-w-[58vw] sm:max-w-[66vw]">
                  {appointment.clientName}
                </span>
                {isHighlighted && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-[color:var(--color-primary)]/25 text-[color:var(--color-primary)]">
                    Destacada
                  </span>
                )}
              </h3>
              <div className="text-xs text-[color:var(--color-muted)] max-w-[70vw]">
                <span
                  className="inline-block"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {servicesLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={appointment.status} className="px-2 py-1 text-[11px]" />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 py-2.5 space-y-2">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-[color:var(--color-primary)]/70 flex-shrink-0" />
            <span className="text-[color:var(--color-muted)] truncate">
              {formatDate(appointment.appointmentDate)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-[color:var(--color-primary)]/70 flex-shrink-0" />
            <span className="text-[color:var(--color-muted)] truncate">
              {formatTime(appointment.appointmentTime)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-[color:var(--color-primary)]/70 flex-shrink-0" />
            <span className="text-[color:var(--color-muted)] truncate">
              {isStudio ? "Studio" : "A domicilio"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-[color:var(--color-muted)]">Total</span>
            <span className="text-[color:var(--color-primary)] font-semibold">
              {priceInfo.totalPrice > 0 ? formatPrice(priceInfo.totalPrice) : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2.5 border-t border-[color:var(--color-border)]/40 bg-[color:var(--color-surface-elevated)]/40 rounded-b-xl flex gap-2">
        {/* Primary Action - Status based */}
        {appointment.status === "PENDING" && (
          <Button
            onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
            disabled={isUpdating}
            variant="outline"
            size="sm"
            className={mobilePrimaryActionClass}
            type="button"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-[color:var(--color-success)]" />
            Confirmar
          </Button>
        )}

        {appointment.status === "CONFIRMED" && (
          <Button
            onClick={() => onStatusUpdate(appointment.id, "COMPLETED")}
            disabled={isUpdating}
            variant="outline"
            size="sm"
            className={mobilePrimaryActionClass}
            type="button"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-[color:var(--color-success)]" />
            Completada
          </Button>
        )}

        {appointment.status === "COMPLETED" && (
          <Button
            onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
            disabled={isUpdating}
            type="button"
            variant="outline"
            size="sm"
            className={mobilePrimaryActionClass}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-[color:var(--color-info)]" />
            Reabrir
          </Button>
        )}

        {appointment.status === "CANCELLED" && (
          <Button
            onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
            disabled={isUpdating}
            type="button"
            variant="outline"
            size="sm"
            className={mobilePrimaryActionClass}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-[color:var(--color-info)]" />
            Reabrir
          </Button>
        )}

        {/* Secondary Actions */}
        <ActionButton tooltip="Ver detalles" onClick={() => onViewDetails(appointment)}>
          <Eye className="w-3.5 h-3.5" />
        </ActionButton>

        <ActionButton
          tooltip="Eliminar"
          onClick={() => onDelete(appointment.id)}
          disabled={isDeleting}
        >
          <Trash2 className="w-3.5 h-3.5 text-[color:var(--color-danger)]" />
        </ActionButton>
      </div>
    </div>
  );
}

function AppointmentRow({
  appointment,
  isHighlighted,
  onStatusUpdate,
  onDelete,
  onViewDetails,
  isUpdating,
  isDeleting,
}: MobileAppointmentCardProps) {
  const priceInfo = getPriceBreakdown(appointment);

  const serviceLabel = formatServices(appointment)
    .map((s) => s.displayText)
    .join(", ");

  return (
    <TableRow
      id={`appointment-${appointment.id}`}
      className={
        isHighlighted
          ? "bg-[color:var(--color-primary)]/12 ring-2 ring-inset ring-[color:var(--color-primary)]/40"
          : ""
      }
    >
      <TableCell className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-[color:var(--color-primary)]/15 text-[color:var(--color-primary)] font-semibold text-xs">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-[color:var(--color-on-surface)]">
              {appointment.clientName}
            </div>
            {isHighlighted && (
              <span className="text-[10px] font-medium text-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10 px-1.5 py-0.5 rounded">
                Destacada
              </span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-[color:var(--color-on-surface)]">{serviceLabel}</div>
        {appointment.district && (
          <div className="text-xs text-[color:var(--color-muted)] mt-1 inline-flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1" /> {appointment.district}
          </div>
        )}
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-[color:var(--color-on-surface)]">
          {formatDate(appointment.appointmentDate)}
        </div>
        <div className="text-xs text-[color:var(--color-muted)] mt-1">
          {formatTime(appointment.appointmentTime)}
        </div>
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">
        {priceInfo.totalPrice > 0 ? (
          <div>
            <div className="text-sm font-semibold text-[color:var(--color-primary)]">
              {formatPrice(priceInfo.totalPrice)}
            </div>
            {(priceInfo.hasTransport || priceInfo.hasNightShift) && (
              <div className="text-xs text-[color:var(--color-muted)]">
                Servicio: {formatPrice(priceInfo.servicePrice)}
                {priceInfo.hasTransport && (
                  <>
                    <br />
                    Movilidad: {formatPrice(priceInfo.transportCost)}
                  </>
                )}
                {priceInfo.hasNightShift && (
                  <>
                    <br />
                    Nocturno: {formatPrice(priceInfo.nightShiftCost)}
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-[color:var(--color-muted)]">—</span>
        )}
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <StatusBadge status={appointment.status} />
          {appointment.status === "COMPLETED" && appointment.review && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-[color:var(--color-accent-secondary)]/15 text-[color:var(--color-accent-secondary)]">
              <Star className="w-3.5 h-3.5 mr-1" /> Review
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex flex-wrap gap-1.5">
          {appointment.status === "PENDING" && (
            <>
              <ActionButton
                tooltip="Confirmar"
                onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                disabled={isUpdating}
              >
                <CheckCircle className="w-4 h-4 text-[color:var(--color-success)]" />
              </ActionButton>
              <ActionButton
                tooltip="Cancelar"
                onClick={() => onStatusUpdate(appointment.id, "CANCELLED")}
                disabled={isUpdating}
              >
                <XCircle className="w-4 h-4 text-[color:var(--color-danger)]" />
              </ActionButton>
            </>
          )}
          {appointment.status === "CONFIRMED" && (
            <>
              <ActionButton
                tooltip="Marcar completada"
                onClick={() => onStatusUpdate(appointment.id, "COMPLETED")}
                disabled={isUpdating}
              >
                <CheckCircle className="w-4 h-4 text-[color:var(--color-success)]" />
              </ActionButton>
              <ActionButton
                tooltip="Copiar link de reseña"
                onClick={() =>
                  appointment.review?.reviewToken && copyReviewLink(appointment.review.reviewToken)
                }
              >
                <Link className="w-4 h-4 text-[color:var(--color-accent-secondary)]" />
              </ActionButton>
            </>
          )}
          {appointment.status === "COMPLETED" && (
            <>
              <ActionButton
                tooltip="Reabrir"
                onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                disabled={isUpdating}
              >
                <RotateCcw className="w-4 h-4 text-[color:var(--color-info)]" />
              </ActionButton>
              <ActionButton
                tooltip="Copiar link de reseña"
                onClick={() =>
                  appointment.review?.reviewToken && copyReviewLink(appointment.review.reviewToken)
                }
              >
                <Link className="w-4 h-4 text-[color:var(--color-accent-secondary)]" />
              </ActionButton>
            </>
          )}
          {appointment.status === "CANCELLED" && (
            <ActionButton
              tooltip="Reabrir"
              onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
              disabled={isUpdating}
            >
              <RotateCcw className="w-4 h-4 text-[color:var(--color-info)]" />
            </ActionButton>
          )}
          <ActionButton tooltip="Ver detalles" onClick={() => onViewDetails(appointment)}>
            <Eye className="w-4 h-4 text-[color:var(--color-accent-secondary)]" />
          </ActionButton>
          <ActionButton
            tooltip="Eliminar"
            onClick={() => onDelete(appointment.id)}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 text-[color:var(--color-danger)]" />
          </ActionButton>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AppointmentTable({
  appointments,
  highlightedId,
  onViewDetails,
}: AppointmentTableProps) {
  const updateStatusMutation = useUpdateAppointmentStatus();
  const deleteMutation = useDeleteAppointment();
  const isMobile = useIsSmallMobile();

  const handleStatusUpdate = (id: string, status: Appointment["status"]) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás segura de que quieres eliminar esta cita?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!appointments || appointments.length === 0) {
    return null;
  }

  // Mobile View
  if (isMobile) {
    return (
      <>
        {appointments.map((appointment) => (
          <MobileAppointmentCard
            key={appointment.id}
            appointment={appointment}
            isHighlighted={appointment.id === highlightedId}
            onStatusUpdate={handleStatusUpdate}
            onDelete={handleDelete}
            onViewDetails={onViewDetails}
            isUpdating={updateStatusMutation.isPending}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </>
    );
  }

  // Desktop View
  return (
    <div className="rounded-lg border border-[color:var(--color-border)] overflow-hidden bg-[color:var(--color-surface)]">
      <Table>
        <TableHeader className="bg-[color:var(--color-surface-elevated)]">
          <TableRow className="border-b border-[color:var(--color-border)] hover:bg-transparent">
            <TableHead className="px-6 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs">
              Cliente
            </TableHead>
            <TableHead className="px-6 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs">
              Servicio
            </TableHead>
            <TableHead className="px-6 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs">
              Fecha & Hora
            </TableHead>
            <TableHead className="px-6 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs">
              Precio
            </TableHead>
            <TableHead className="px-6 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs">
              Estado
            </TableHead>
            <TableHead className="px-6 py-3 text-[color:var(--color-muted)] uppercase tracking-wider text-xs">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <AppointmentRow
              key={appointment.id}
              appointment={appointment}
              isHighlighted={appointment.id === highlightedId}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
              onViewDetails={onViewDetails}
              isUpdating={updateStatusMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
