"use client";
import StatusBadge from "@/components/appointments/StatusBadge";
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
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Link,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Star,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import React from "react";

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
  const servicesLabel = formatServices(appointment)
    .map((s) => s.displayText)
    .join(", ");
  const isStudio = (appointment.location || "").toLowerCase().includes("studio");
  const locationText = isStudio
    ? "En estudio - Av. Bolívar 1073, Pueblo Libre"
    : [appointment.address, appointment.district].filter(Boolean).join(", ");

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
        className={`relative px-4 py-3 border-b bg-[color:var(--color-surface-elevated)] rounded-t-xl ${
          isHighlighted
            ? "border-[color:var(--color-primary)]/40"
            : "border-transparent sm:border-[color:var(--color-border)]/40"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-[color:var(--color-primary)]/15 ring-1 ring-[color:var(--color-border)] flex items-center justify-center">
              <User className="w-4 h-4 text-[color:var(--color-primary)]" />
            </div>
            <div className="min-w-0 pr-20">
              <h3 className="font-semibold text-[color:var(--color-heading)] text-sm leading-tight truncate max-w-[70vw]">
                <span className="block truncate text-base sm:text-base font-semibold">
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
                  style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                  {servicesLabel}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute right-3 top-3">
            <StatusBadge status={appointment.status} className="px-2 py-1 text-[11px]" />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 py-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[color:var(--color-primary)]/70" />
            <span className="text-xs text-[color:var(--color-muted)]">
              {formatDate(appointment.appointmentDate)}
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-[color:var(--color-primary)]/70" />
            <span className="text-xs text-[color:var(--color-muted)]">
              {formatTime(appointment.appointmentTime)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
          <span className="text-xs text-[color:var(--color-muted)] truncate">
            {locationText || (isStudio ? "En estudio - Av. Bolívar 1073, Pueblo Libre" : "Servicio a domicilio")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-1.5 min-w-0">
            <Phone className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
            <span className="text-xs text-[color:var(--color-muted)] truncate">
              {appointment.clientPhone}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 min-w-0">
            <Mail className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
            <span className="text-xs text-[color:var(--color-muted)] truncate">
              {appointment.clientEmail}
            </span>
          </div>
        </div>

        {(priceInfo.hasTransport || priceInfo.hasNightShift || priceInfo.totalPrice > 0) && (
          <div className="rounded-lg p-3 border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)]/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[color:var(--color-muted)]">
                <DollarSign className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
                <span className="text-xs">Total</span>
              </div>
              <div className="text-sm font-semibold text-[color:var(--color-primary)]">
                {formatPrice(priceInfo.totalPrice)}
              </div>
            </div>
            {(priceInfo.hasTransport || priceInfo.hasNightShift) && (
              <div className="mt-2 text-[11px] text-[color:var(--color-muted)]">
                <span>Servicios: {formatPrice(priceInfo.servicePrice)}</span>
                {priceInfo.hasTransport && (
                  <span className="ml-2">· Movilidad: {formatPrice(priceInfo.transportCost)}</span>
                )}
                {priceInfo.hasNightShift && (
                  <span className="ml-2">· Nocturno: {formatPrice(priceInfo.nightShiftCost)}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-[color:var(--color-border)]/40 bg-[color:var(--color-surface-elevated)]/40 rounded-b-xl">
        <div className="grid grid-cols-2 gap-2">
          {appointment.status === "PENDING" && (
            <>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                disabled={isUpdating}
                className="bg-success text-on-success hover:opacity-90 px-3 py-2 rounded-lg text-xs disabled:opacity-50 font-medium transition-colors inline-flex items-center justify-center"
                type="button"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirmar
              </button>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CANCELLED")}
                disabled={isUpdating}
                className="bg-danger text-on-danger hover:opacity-90 px-3 py-2 rounded-lg text-xs disabled:opacity-50 font-medium transition-colors inline-flex items-center justify-center"
                type="button"
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
                className="bg-success text-on-success hover:opacity-90 px-3 py-2 rounded-lg text-xs disabled:opacity-50 font-medium transition-colors inline-flex items-center justify-center"
                type="button"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Marcar Completada
              </button>
              <button
                onClick={() =>
                  appointment.review?.reviewToken && copyReviewLink(appointment.review.reviewToken)
                }
                type="button"
                className="bg-[color:var(--color-accent-secondary)] text-[color:var(--color-on-accent-contrast)] hover:opacity-90 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors inline-flex items-center justify-center"
              >
                <Link className="w-4 h-4 mr-1" />
                Copiar Link
              </button>
            </>
          )}

          {appointment.status === "COMPLETED" && (
            <>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                disabled={isUpdating}
                type="button"
                className="bg-info text-on-info hover:opacity-90 px-3 py-2 rounded-lg text-xs disabled:opacity-50 font-medium transition-colors inline-flex items-center justify-center"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reabrir (Confirmada)
              </button>
              <button
                onClick={() =>
                  appointment.review?.reviewToken && copyReviewLink(appointment.review.reviewToken)
                }
                type="button"
                className="bg-[color:var(--color-accent-secondary)] text-[color:var(--color-on-accent-contrast)] hover:opacity-90 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors inline-flex items-center justify-center"
              >
                <Link className="w-4 h-4 mr-1" />
                Copiar Link
              </button>
            </>
          )}

          {appointment.status === "CANCELLED" && (
            <button
              onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
              disabled={isUpdating}
              type="button"
              className="bg-info text-on-info hover:opacity-90 px-3 py-2 rounded-lg text-xs disabled:opacity-50 font-medium transition-colors"
            >
              Reabrir (Confirmada)
            </button>
          )}

          <button
            onClick={() => onViewDetails(appointment)}
            type="button"
            className="bg-accent-secondary text-on-accent-contrast hover:opacity-90 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            Ver Detalles
          </button>

          <button
            onClick={() => onDelete(appointment.id)}
            disabled={isDeleting}
            type="button"
            className="bg-danger text-on-danger hover:opacity-90 px-3 py-2 rounded-lg text-xs disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[40px]"
          >
            Eliminar
          </button>
        </div>
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
            <div className="text-sm font-medium text-[color:var(--color-on-surface)]">
              {appointment.clientName}
            </div>
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
        <div className="text-sm text-[color:var(--color-on-surface)]">
          {formatDate(appointment.appointmentDate)}
        </div>
        <div className="text-xs text-[color:var(--color-muted)] mt-1">
          {formatTime(appointment.appointmentTime)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
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
                  type="button"
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
                  type="button"
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
                  type="button"
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
                  onClick={() =>
                    appointment.review?.reviewToken &&
                    copyReviewLink(appointment.review.reviewToken)
                  }
                  type="button"
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
                  type="button"
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
                  onClick={() =>
                    appointment.review?.reviewToken &&
                    copyReviewLink(appointment.review.reviewToken)
                  }
                  type="button"
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
                type="button"
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
              type="button"
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
              type="button"
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
    <div className="overflow-x-auto bg-[color:var(--color-surface)]">
      <table className="min-w-full divide-y divide-[color:var(--color-border)]">
        <thead className="bg-[color:var(--color-surface-elevated)]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
              Servicio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
              Fecha & Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--color-muted)] uppercase tracking-wider">
              Acciones
            </th>
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
