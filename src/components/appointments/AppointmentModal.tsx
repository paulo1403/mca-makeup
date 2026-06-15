"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Calendar, Clock, MapPin, Pencil, Star } from "lucide-react";
import StatusBadge from "@/components/appointments/StatusBadge";
import {
  buildQuoteText,
  copyQuotePngToClipboard,
  generateQuotePng,
} from "@/components/share/QuoteShareCard";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import {
  type Appointment,
  useDeleteAppointment,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import { formatDate, formatPrice, formatTime, getPriceBreakdown } from "@/utils/appointmentHelpers";
import { copyReviewLink, getReviewStatusColor, getReviewStatusText } from "@/utils/reviewHelpers";

interface AppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (appointment: Appointment) => void;
}

export default function AppointmentModal({ appointment, isOpen, onClose, onEdit }: AppointmentModalProps) {
  const updateStatusMutation = useUpdateAppointmentStatus();
  const deleteMutation = useDeleteAppointment();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [copyTextBtn, setCopyTextBtn] = useState("Copiar texto");
  const [exportBtn, setExportBtn] = useState("Exportar PNG");

  if (!isOpen || !appointment) return null;

  const handleStatusUpdate = (status: Appointment["status"]) => {
    updateStatusMutation.mutate({ id: appointment.id, status });
    onClose();
  };

  const handleExportPng = async () => {
    setExportBtn("Exportando...");
    try {
      const copied = await copyQuotePngToClipboard({ appointment, deposit: 150 });
      if (!copied) {
        const blob = await generateQuotePng({ appointment, deposit: 150 });
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `presupuesto-${appointment.id}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success("Imagen descargada");
        }
      } else {
        toast.success("Imagen copiada al portapapeles");
      }
      setExportBtn("Exportado");
    } catch {
      toast.error("No se pudo exportar la imagen");
      setExportBtn("Error");
    } finally {
      setTimeout(() => setExportBtn("Exportar PNG"), 1800);
    }
  };

  const handleCopyBudgetText = async () => {
    setCopyTextBtn("Copiando...");
    try {
      await navigator.clipboard.writeText(buildQuoteText({ appointment, deposit: 150 }));
      toast.success("Texto copiado al portapapeles");
      setCopyTextBtn("Copiado");
    } catch {
      toast.error("No se pudo copiar el texto");
      setCopyTextBtn("Error");
    } finally {
      setTimeout(() => setCopyTextBtn("Copiar texto"), 1800);
    }
  };

  const priceInfo = getPriceBreakdown(appointment);
  const isStudio = (appointment.location || "").toLowerCase().includes("studio");

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="md"
      closeOnBackdrop={false}
      ariaLabelledBy="appointment-details-title"
    >
      <ModalHeader
        title={
          <div id="appointment-details-title" className="flex items-center gap-3">
            <span className="text-base font-semibold text-[color:var(--color-heading)]">
              {appointment.clientName}
            </span>
            <StatusBadge status={appointment.status} className="text-[11px]" />
          </div>
        }
        onClose={onClose}
      />
      <ModalBody>
        <div className="divide-y divide-[color:var(--color-border)]">
          <div className="grid grid-cols-2 gap-4 pb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[color:var(--color-primary)]/60" />
                <span className="text-[11px] text-[color:var(--color-muted)] font-medium">
                  Fecha
                </span>
              </div>
              <p className="text-sm text-[color:var(--color-heading)]">
                {formatDate(appointment.appointmentDate)}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3 text-[color:var(--color-primary)]/60" />
                <span className="text-xs text-[color:var(--color-body)]">
                  {formatTime(appointment.appointmentTime)}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[color:var(--color-primary)]/60" />
                <span className="text-[11px] text-[color:var(--color-muted)] font-medium">
                  Ubicación
                </span>
              </div>
              <p className="text-sm text-[color:var(--color-heading)]">
                {isStudio ? "Av. Bolívar 1073, Pueblo Libre" : "A domicilio"}
              </p>
              {appointment.district && (
                <p className="text-xs text-[color:var(--color-muted)] mt-0.5">
                  {appointment.district}
                </p>
              )}
            </div>
          </div>

          <div className="py-3 space-y-1.5">
            <Row label="Email" value={appointment.clientEmail} />
            {appointment.clientPhone && <Row label="Teléfono" value={appointment.clientPhone} />}
            {appointment.clientDocument && (
              <Row
                label={appointment.documentType === "PE" ? "DNI" : "Doc"}
                value={appointment.clientDocument}
              />
            )}
          </div>

          {appointment.address && (
            <div className="py-3 space-y-2">
              <p className="text-sm text-[color:var(--color-body)]">{appointment.address}</p>
              {appointment.addressReference && (
                <p className="text-xs text-[color:var(--color-muted)]">
                  Ref: {appointment.addressReference}
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${appointment.address}${appointment.district ? `, ${appointment.district}` : ""}, Lima, Perú`,
                    );
                    toast.success("Dirección copiada");
                  }}
                >
                  Copiar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  className="flex-1"
                  onClick={() => {
                    window.open(
                      `https://maps.google.com/maps?q=${encodeURIComponent(`${appointment.address}${appointment.district ? `, ${appointment.district}` : ""}, Lima, Perú`)}`,
                      "_blank",
                    );
                  }}
                >
                  Maps
                </Button>
              </div>
            </div>
          )}

          {priceInfo.totalPrice > 0 && (
            <div className="py-3 space-y-1.5">
              {appointment.services?.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--color-body)]">
                    {s.name}
                    {s.quantity > 1 && (
                      <span className="text-[color:var(--color-muted)]"> ×{s.quantity}</span>
                    )}
                  </span>
                  <span className="font-medium text-[color:var(--color-heading)]">
                    {formatPrice(s.price * s.quantity)}
                  </span>
                </div>
              ))}
              {appointment.services && appointment.services.length > 0 && (
                <div className="border-t border-[color:var(--color-border)] my-1.5" />
              )}
              <Row label="Servicios" value={formatPrice(priceInfo.servicePrice)} />
              {priceInfo.hasTransport && (
                <Row label="Movilidad" value={formatPrice(priceInfo.transportCost)} />
              )}
              {priceInfo.hasNightShift && (
                <Row label="Nocturno" value={formatPrice(priceInfo.nightShiftCost)} />
              )}
              <div className="flex items-center justify-between pt-1.5 border-t border-[color:var(--color-border)] mt-1.5">
                <span className="text-sm font-semibold text-[color:var(--color-heading)]">
                  Total
                </span>
                <span className="text-base font-bold text-[color:var(--color-primary)]">
                  {formatPrice(priceInfo.totalPrice)}
                </span>
              </div>
            </div>
          )}

          {appointment.additionalNotes && (
            <div className="py-3">
              <p className="text-sm text-[color:var(--color-body)] whitespace-pre-wrap break-words">
                {appointment.additionalNotes}
              </p>
            </div>
          )}

          {appointment.status === "COMPLETED" && appointment.review && (
            <div className="py-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
                <span className="text-[11px] text-[color:var(--color-muted)] font-medium uppercase tracking-wider">
                  Reseña
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[color:var(--color-muted)]">Estado:</span>
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getReviewStatusColor(appointment.review.status)}`}
                >
                  {getReviewStatusText(appointment.review.status)}
                </span>
              </div>
              {appointment.review.rating && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[color:var(--color-muted)]">Calificación:</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= (appointment.review?.rating ?? 0) ? "text-[color:var(--color-primary)] fill-current" : "text-[color:var(--color-border)]"}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              {appointment.review.reviewToken && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[color:var(--color-muted)]">Link:</span>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => copyReviewLink(appointment.review?.reviewToken ?? "")}
                  >
                    Copiar
                  </Button>
                </div>
              )}
              {appointment.review.reviewText && (
                <p className="text-sm text-[color:var(--color-body)] italic bg-[color:var(--color-surface-elevated)] p-2.5 rounded-lg border border-[color:var(--color-border)]">
                  &ldquo;{appointment.review.reviewText}&rdquo;
                </p>
              )}
            </div>
          )}

          <div className="pt-3 space-y-1 text-xs text-[color:var(--color-muted)]">
            <p>Creada: {new Date(appointment.createdAt).toLocaleString("es-ES")}</p>
            <p>Actualizada: {new Date(appointment.updatedAt).toLocaleString("es-ES")}</p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="xs"
            type="button"
            onClick={handleCopyBudgetText}
            disabled={copyTextBtn !== "Copiar texto"}
          >
            {copyTextBtn}
          </Button>
          <Button
            variant="outline"
            size="xs"
            type="button"
            onClick={handleExportPng}
            disabled={exportBtn !== "Exportar PNG"}
          >
            {exportBtn}
          </Button>
          {onEdit && (
            <Button
              variant="outline"
              size="xs"
              type="button"
              onClick={() => {
                onEdit(appointment);
                onClose();
              }}
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar
            </Button>
          )}
          {appointment.status === "CONFIRMED" && (
            <Button
              variant="primary"
              size="xs"
              type="button"
              onClick={() => handleStatusUpdate("COMPLETED")}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "Completando..." : "Marcar Completada"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="xs"
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="ml-auto text-[color:var(--color-danger)]"
          >
            Eliminar
          </Button>
        </div>
      </ModalFooter>

      <ConfirmModal
        open={isDeleteOpen}
        title="Eliminar cita"
        description="¿Estás segura de que quieres eliminar esta cita? Esta acción no se puede deshacer."
        confirmText={deleteMutation.isPending ? "Eliminando..." : "Confirmar eliminación"}
        cancelText="Cancelar"
        destructive
        onConfirm={() => {
          deleteMutation.mutate(appointment.id, {
            onSuccess: () => {
              toast.success("Cita eliminada");
              setIsDeleteOpen(false);
              onClose();
            },
            onError: (err) => {
              toast.error(err instanceof Error ? err.message : "No se pudo eliminar la cita");
            },
          });
        }}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[color:var(--color-muted)]">{label}</span>
      <span className="text-sm font-medium text-[color:var(--color-heading)] text-right max-w-[65%] truncate">
        {value}
      </span>
    </div>
  );
}
