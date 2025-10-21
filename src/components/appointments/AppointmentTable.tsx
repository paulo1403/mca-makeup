'use client';
import React from "react";
import {
  Appointment,
  useUpdateAppointmentStatus,
  useDeleteAppointment,
} from "@/hooks/useAppointments";
import {
  formatDate,
  formatTime,
  formatPrice,
  formatServices,
  getPriceBreakdown,
} from "@/utils/appointmentHelpers";
import { copyReviewLink } from "@/utils/reviewHelpers";
import { useIsSmallMobile } from "@/hooks/useMediaQuery";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  RotateCcw,
  Link,
  Eye,
  Trash2,
} from "lucide-react";
import StatusBadge from "@/components/appointments/StatusBadge";

interface AppointmentTableProps {
  appointments: Appointment[];
  highlightedId?: string;
  onViewDetails: (appointment: Appointment) => void;
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
  const priceInfo = getPriceBreakdown(appointment);
  const servicesLabel = formatServices(appointment).map(s => s.displayText).join(', ');

  return (
    <div
      id={`appointment-${appointment.id}`}
      className={[
        "bg-[color:var(--color-surface)]",
        "rounded-lg",
        "border",
        "shadow-sm",
        "hover:shadow-md",
        "transition-all",
        "duration-200",
        isHighlighted
          ? "border-[color:var(--color-primary)]/60 bg-[color:var(--color-primary)]/10 ring-2 ring-[color:var(--color-primary)]/40"
          : "border-[color:var(--color-border)]",
      ].join(" ")}
    >
      {/* Header */}
      <div
        className={`p-3 border-b ${
          isHighlighted ? "border-[color:var(--color-primary)]/40" : "border-[color:var(--color-border)]"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-[color:var(--color-primary)]/15 flex items-center justify-center">
              <User className="w-4 h-4 text-[color:var(--color-primary)]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[color:var(--color-on-surface)] text-sm leading-tight truncate max-w-[65vw] sm:max-w-[40vw]">
                <span className="block truncate text-base sm:text-base font-semibold">{appointment.clientName}</span>
                {isHighlighted && (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-[color:var(--color-primary)]/25 text-[color:var(--color-primary)]">
                    Destacada
                  </span>
                )}
              </h3>
              <div className="text-xs text-[color:var(--color-muted)] truncate max-w-[65vw] sm:max-w-[40vw]">
                <span className="inline-block truncate">{servicesLabel}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <StatusBadge status={appointment.status} />
            {appointment.status === "COMPLETED" && appointment.review && (
              <span className="inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium rounded-full bg-[color:var(--color-accent-secondary)]/15 text-[color:var(--color-accent-secondary)]">
                <Star className="w-3 h-3 mr-1" /> Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-3 space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[color:var(--color-primary)]/70" />
            <span className="text-xs text-[color:var(--color-muted)]">{formatDate(appointment.appointmentDate)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-[color:var(--color-primary)]/70" />
            <span className="text-xs text-[color:var(--color-muted)]">{formatTime(appointment.appointmentTime)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
          <span className="text-xs text-[color:var(--color-muted)] truncate">{appointment.address}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-1.5 min-w-0">
            <Phone className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
            <span className="text-xs text-[color:var(--color-muted)] truncate">{appointment.clientPhone}</span>
          </div>
          <div className="flex items-center space-x-1.5 min-w-0">
            <Mail className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
            <span className="text-xs text-[color:var(--color-muted)] truncate">{appointment.clientEmail}</span>
          </div>
        </div>

        {(priceInfo.hasTransport || priceInfo.hasNightShift || priceInfo.totalPrice > 0) && (
          <div className="bg-[color:var(--color-surface-elevated)]/40 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[color:var(--color-muted)]">
                <DollarSign className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
                <span className="text-xs">Precio</span>
              </div>
              <div className="text-sm font-semibold text-[color:var(--color-primary)]">{formatPrice(priceInfo.totalPrice)}</div>
            </div>
            {(priceInfo.hasTransport || priceInfo.hasNightShift) && (
              <div className="mt-2 text-[11px] text-[color:var(--color-muted)]">
                {priceInfo.hasTransport && (
                  <>
                    <br />Movilidad: {formatPrice(priceInfo.transportCost)}
                  </>
                )}
                {priceInfo.hasNightShift && (
                  <>
                    <br />Nocturno: {formatPrice(priceInfo.nightShiftCost)}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t bg-[color:var(--color-surface-elevated)]/50">
        <div className="grid grid-cols-2 gap-2">
          {appointment.status === "PENDING" && (
            <>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                disabled={isUpdating}
                className="bg-success text-on-success hover:opacity-90 px-3 py-2 rounded-lg text-sm disabled:opacity-50 font-medium transition-colors inline-flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirmar
              </button>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CANCELLED")}
                disabled={isUpdating}
                className="bg-danger text-on-danger hover:opacity-90 px-3 py-2 rounded-lg text-sm disabled:opacity-50 font-medium transition-colors inline-flex items-center justify-center"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Cancelar
              </button>
            </>
          )}

          {appointment.status === "CONFIRMED" && (
            <>
              <button
                onClick={() => onStatusUpdate(appointment.id, "COMPLETED")}
                disabled={isUpdating}
                className="bg-success text-on-success hover:opacity-90 px-3 py-2 rounded-lg text-sm disabled:opacity-50 font-medium transition-colors inline-flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Marcar Completada
              </button>
              <button
                onClick={() => appointment.review?.reviewToken && copyReviewLink(appointment.review.reviewToken)}
                className="bg-[color:var(--color-accent-secondary)] text-[color:var(--color-on-accent-contrast)] hover:opacity-90 px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center"
              >
                <Link className="w-4 h-4 mr-1" />
                Copiar Link Review
              </button>
            </>
          )}

          {appointment.status === "COMPLETED" && (
            <>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                disabled={isUpdating}
                className="bg-info text-on-info hover:opacity-90 px-3 py-2 rounded-lg text-sm disabled:opacity-50 font-medium transition-colors inline-flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reabrir (Confirmada)
              </button>
              <button
                onClick={() => appointment.review?.reviewToken && copyReviewLink(appointment.review.reviewToken)}
                className="bg-[color:var(--color-accent-secondary)] text-[color:var(--color-on-accent-contrast)] hover:opacity-90 px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center justify-center"
              >
                <Link className="w-4 h-4 mr-1" />
                Copiar Link Review
              </button>
            </>
          )}

          {appointment.status === "CANCELLED" && (
            <button
              onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
              disabled={isUpdating}
              className="bg-info text-on-info hover:opacity-90 px-3 py-2 rounded-lg text-sm disabled:opacity-50 font-medium transition-colors"
            >
              Reabrir (Confirmada)
            </button>
          )}

          <button
            onClick={() => onViewDetails(appointment)}
            className="bg-accent-secondary text-on-accent-contrast hover:opacity-90 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Ver Detalles
          </button>

          <button
            onClick={() => onDelete(appointment.id)}
            disabled={isDeleting}
            className="bg-danger text-on-danger hover:opacity-90 px-3 py-2 rounded-lg text-sm disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[40px]"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// Desktop Row Component
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
    <tr
      id={`appointment-${appointment.id}`}
      className={`${isHighlighted ? "bg-[color:var(--color-primary)]/12 ring-2 ring-[color:var(--color-primary)]/40" : ""} hover:bg-[color:var(--color-surface-elevated)]/40 transition-colors`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[color:var(--color-primary)]/15 flex items-center justify-center">
            <User className="w-5 h-5 text-[color:var(--color-primary)]" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-[color:var(--color-on-surface)]">{appointment.clientName}</div>
            <div className="text-sm text-[color:var(--color-muted)]">{serviceLabel}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-[color:var(--color-on-surface)]">{serviceLabel}</div>
        {appointment.district && (
          <div className="text-xs text-[color:var(--color-muted)] mt-1 inline-flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1" /> {appointment.district}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-[color:var(--color-on-surface)]">{formatDate(appointment.appointmentDate)}</div>
        <div className="text-xs text-[color:var(--color-muted)] mt-1">{formatTime(appointment.appointmentTime)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {priceInfo.totalPrice > 0 ? (
          <div>
            <div className="text-sm font-semibold text-[color:var(--color-primary)]">{formatPrice(priceInfo.totalPrice)}</div>
            {(priceInfo.hasTransport || priceInfo.hasNightShift) && (
              <div className="text-xs text-[color:var(--color-muted)]">
                Servicio: {formatPrice(priceInfo.servicePrice)}
                {priceInfo.hasTransport && (
                  <>
                    <br />Movilidad: {formatPrice(priceInfo.transportCost)}
                  </>
                )}
                {priceInfo.hasNightShift && (
                  <>
                    <br />Nocturno: {formatPrice(priceInfo.nightShiftCost)}
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-[color:var(--color-muted)]">—</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <StatusBadge status={appointment.status} />
          {appointment.status === "COMPLETED" && appointment.review && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-[color:var(--color-accent-secondary)]/15 text-[color:var(--color-accent-secondary)]">
              <Star className="w-3.5 h-3.5 mr-1" /> Review
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex flex-wrap gap-2">
          {appointment.status === "PENDING" && (
            <>
              <div className="relative group">
                <button
                  aria-label="Confirmar"
                  onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5 text-[color:var(--color-success)]" />
                  <span className="sr-only">Confirmar</span>
                </button>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
                  Confirmar
                </div>
              </div>
              <div className="relative group">
                <button
                  aria-label="Cancelar"
                  onClick={() => onStatusUpdate(appointment.id, "CANCELLED")}
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring disabled:opacity-50"
                >
                  <XCircle className="w-5 h-5 text-[color:var(--color-danger)]" />
                  <span className="sr-only">Cancelar</span>
                </button>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
                  Cancelar
                </div>
              </div>
            </>
          )}

          {appointment.status === "CONFIRMED" && (
            <>
              <div className="relative group">
                <button
                  aria-label="Marcar completada"
                  onClick={() => onStatusUpdate(appointment.id, "COMPLETED")}
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5 text-[color:var(--color-success)]" />
                  <span className="sr-only">Marcar completada</span>
                </button>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
                  Completada
                </div>
              </div>
              <div className="relative group">
                <button
                  aria-label="Copiar link de reseña"
                  onClick={() => appointment.review?.reviewToken && copyReviewLink(appointment.review.reviewToken)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring"
                >
                  <Link className="w-5 h-5 text-[color:var(--color-accent-secondary)]" />
                  <span className="sr-only">Copiar link de reseña</span>
                </button>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
                  Review link
                </div>
              </div>
            </>
          )}

          {appointment.status === "COMPLETED" && (
            <>
              <div className="relative group">
                <button
                  aria-label="Reabrir"
                  onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring disabled:opacity-50"
                >
                  <RotateCcw className="w-5 h-5 text-[color:var(--color-info)]" />
                  <span className="sr-only">Reabrir</span>
                </button>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
                  Reabrir
                </div>
              </div>
              <div className="relative group">
                <button
                  aria-label="Copiar link de reseña"
                  onClick={() => appointment.review?.reviewToken && copyReviewLink(appointment.review.reviewToken)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring"
                >
                  <Link className="w-5 h-5 text-[color:var(--color-accent-secondary)]" />
                  <span className="sr-only">Copiar link de reseña</span>
                </button>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
                  Review link
                </div>
              </div>
            </>
          )}

          {appointment.status === "CANCELLED" && (
            <div className="relative group">
              <button
                aria-label="Reabrir"
                onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                disabled={isUpdating}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring disabled:opacity-50"
              >
                <RotateCcw className="w-5 h-5 text-[color:var(--color-info)]" />
                <span className="sr-only">Reabrir</span>
              </button>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
                Reabrir
              </div>
            </div>
          )}

          <div className="relative group">
            <button
              aria-label="Ver detalles"
              onClick={() => onViewDetails(appointment)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring"
            >
              <Eye className="w-5 h-5 text-[color:var(--color-accent-secondary)]" />
              <span className="sr-only">Ver detalles</span>
            </button>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
              Ver detalles
            </div>
          </div>

          <div className="relative group">
            <button
              aria-label="Eliminar"
              onClick={() => onDelete(appointment.id)}
              disabled={isDeleting}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] hover:bg-[color:var(--color-surface)] transition-colors focus-ring disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5 text-[color:var(--color-danger)]" />
              <span className="sr-only">Eliminar</span>
            </button>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] shadow-sm opacity-0 group-hover:opacity-100">
              Eliminar
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

// Main Component
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
    return null; // Empty state handled by parent
  }

  // Mobile View
  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
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
      </div>
    );
  }

  // Desktop View
  return (
    <div className="overflow-x-auto bg-[color:var(--color-surface)]">
      <table className="min-w-full divide-y divide-[color:var(--color-border)]">
        <thead className="bg-[color:var(--color-surface-elevated)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">Servicio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">Fecha & Hora</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">Precio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-[color:var(--color-surface)] divide-y divide-[color:var(--color-border)]">
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
        </tbody>
      </table>
    </div>
  );
}
