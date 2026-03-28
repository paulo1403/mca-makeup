"use client";
import type React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import StatusBadge from "@/components/appointments/StatusBadge";
import {
  buildQuoteText,
  copyQuotePngToClipboard,
  generateQuotePng,
} from "@/components/share/QuoteShareCard";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import Typography from "@/components/ui/Typography";
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
}

export default function AppointmentModal({ appointment, isOpen, onClose }: AppointmentModalProps) {
  const updateStatusMutation = useUpdateAppointmentStatus();
  const deleteMutation = useDeleteAppointment();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [showNotes, setShowNotes] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleStatusUpdate = (status: Appointment["status"]) => {
    updateStatusMutation.mutate({ id: appointment.id, status });
    onClose();
  };

  const handleExportPng = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const btn = event.currentTarget;
    const original = btn.textContent;
    btn.disabled = true;
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
      btn.textContent = "✅ Exportado";
    } catch {
      toast.error("No se pudo exportar la imagen");
      btn.textContent = "⚠️ Error";
    } finally {
      setTimeout(() => {
        btn.textContent = original || "Exportar PNG";
        btn.disabled = false;
      }, 1800);
    }
  };

  const handleCopyBudgetText = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const btn = event.currentTarget;
    const original = btn.textContent;
    try {
      await navigator.clipboard.writeText(buildQuoteText({ appointment, deposit: 150 }));
      toast.success("Texto copiado al portapapeles");
      btn.textContent = "✅ Copiado";
    } catch {
      toast.error("No se pudo copiar el texto");
      btn.textContent = "⚠️ Error";
    } finally {
      setTimeout(() => {
        btn.textContent = original || "Copiar texto";
      }, 1800);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="md" ariaLabelledBy="appointment-details-title">
      <ModalHeader
        title={
          <Typography as="span" id="appointment-details-title" variant="h3">
            Detalles de la Cita
          </Typography>
        }
        onClose={onClose}
      />
      <ModalBody>
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-3">
            <div className="bg-[color:var(--color-surface)] p-3 rounded-lg border border-[color:var(--color-border)]">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="space-y-1">
                  <div className="text-base font-semibold text-[color:var(--color-heading)]">
                    {appointment.clientName}
                  </div>
                  <div className="text-xs text-[color:var(--color-muted)]">
                    {appointment.clientEmail}
                  </div>
                  <div className="text-xs text-[color:var(--color-on-surface)]">
                    {formatDate(appointment.appointmentDate)} ·{" "}
                    {formatTime(appointment.appointmentTime)}
                  </div>
                </div>
                <StatusBadge
                  status={appointment.status}
                  className="text-xs px-2 py-1 font-semibold"
                />
              </div>
            </div>

            <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]">
              <button
                type="button"
                onClick={() => setShowLocation((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm font-semibold text-[color:var(--color-on-surface)]">
                  Ubicación
                </span>
                <span className="text-xs text-[color:var(--color-muted)]">
                  {showLocation ? "Ocultar" : "Mostrar"}
                </span>
              </button>
              {showLocation && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-[color:var(--color-on-surface)] font-medium">
                    {appointment.location?.includes("Studio")
                      ? "En estudio - Av. Bolívar 1073, Pueblo Libre"
                      : "Servicio a domicilio"}
                  </p>
                  {appointment.address && (
                    <div className="space-y-2">
                      <p className="text-xs text-[color:var(--color-muted)]">
                        {appointment.address}
                        {appointment.addressReference && ` (${appointment.addressReference})`}
                        {appointment.district && `, ${appointment.district}`}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(event) => {
                            const fullAddress = `${appointment.address}${appointment.district ? `, ${appointment.district}` : ""}, Lima, Perú`;
                            navigator.clipboard.writeText(fullAddress);
                            const btn = event.currentTarget;
                            const originalText = btn.textContent;
                            btn.textContent = "✅ Copiado!";
                            setTimeout(() => {
                              btn.textContent = originalText;
                            }, 2000);
                          }}
                          className="flex-1 px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] text-[color:var(--color-on-surface)] border border-[color:var(--color-border)] rounded hover:opacity-70 transition-colors font-medium"
                        >
                          Copiar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const fullAddress = `${appointment.address}${appointment.district ? `, ${appointment.district}` : ""}, Lima, Perú`;
                            const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}`;
                            window.open(mapsUrl, "_blank");
                          }}
                          className="flex-1 px-2 py-1 text-xs bg-[color:var(--color-surface-elevated)] text-[color:var(--color-accent-secondary)] border border-[color:var(--color-border)] rounded hover:opacity-70 transition-colors font-medium"
                        >
                          Maps
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Price Info */}
          {(() => {
            const priceInfo = getPriceBreakdown(appointment);
            if (priceInfo.totalPrice > 0) {
              return (
                <div className="bg-[color:var(--color-surface)] p-3 rounded-lg border border-[color:var(--color-border)] space-y-2">
                  <div className="text-xs font-semibold text-[color:var(--color-on-surface)]">
                    Precios
                  </div>
                  {appointment.services && appointment.services.length > 0 && (
                    <div className="space-y-1">
                      {appointment.services.map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-xs">
                          <span className="text-[color:var(--color-on-surface)]">
                            {s.name}
                            {s.quantity > 1 ? ` ×${s.quantity}` : ""}
                          </span>
                          <span className="font-semibold text-[color:var(--color-on-surface)]">
                            {formatPrice(s.price * s.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-[color:var(--color-border)] pt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[color:var(--color-muted)]">Servicios</span>
                      <span className="text-[color:var(--color-on-surface)]">
                        {formatPrice(priceInfo.servicePrice)}
                      </span>
                    </div>
                    {priceInfo.hasTransport && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[color:var(--color-muted)]">Movilidad</span>
                        <span className="text-[color:var(--color-on-surface)]">
                          {formatPrice(priceInfo.transportCost)}
                        </span>
                      </div>
                    )}
                    {priceInfo.hasNightShift && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[color:var(--color-muted)]">Nocturno</span>
                        <span className="text-[color:var(--color-on-surface)]">
                          {formatPrice(priceInfo.nightShiftCost)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between font-semibold text-sm pt-1">
                      <span className="text-[color:var(--color-heading)]">Total</span>
                      <span className="text-[color:var(--color-primary)]">
                        {formatPrice(priceInfo.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {appointment.additionalNotes && (
            <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]">
              <button
                type="button"
                onClick={() => setShowNotes((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm font-semibold text-[color:var(--color-on-surface)]">
                  Notas
                </span>
                <span className="text-xs text-[color:var(--color-muted)]">
                  {showNotes ? "Ocultar" : "Mostrar"}
                </span>
              </button>
              {showNotes && (
                <div className="px-4 pb-4">
                  <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-3">
                    <p className="text-xs leading-5 text-[color:var(--color-muted)] whitespace-pre-wrap break-words">
                      {appointment.additionalNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-3 border-t border-[color:var(--color-border)]">
            <span className="text-xs font-semibold text-[color:var(--color-on-surface)]">
              Estado:
            </span>
            <StatusBadge status={appointment.status} className="text-xs px-2 py-1 font-semibold" />
          </div>

          {appointment.status === "COMPLETED" && appointment.review && (
            <div className="bg-[color:var(--color-surface-elevated)] p-3 rounded-lg border border-[color:var(--color-border)]">
              <h3 className="text-xs font-semibold text-[color:var(--color-on-surface)] mb-2">
                Reseña
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--color-muted)]">Estado:</span>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getReviewStatusColor(appointment.review.status)}`}
                  >
                    {getReviewStatusText(appointment.review.status)}
                  </span>
                </div>
                {appointment.review.rating && (
                  <div className="flex items-center justify-between">
                    <span className="text-[color:var(--color-muted)]">Calificación:</span>
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={`star-${star}`}
                          className={`w-3.5 h-3.5 ${star <= (appointment.review?.rating ?? 0) ? "text-[color:var(--color-primary)] fill-current" : "text-[color:var(--color-border)]"}`}
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                )}
                {appointment.review.reviewToken && (
                  <div className="flex items-center justify-between">
                    <span className="text-[color:var(--color-muted)]">Link:</span>
                    <button
                      type="button"
                      onClick={(event) =>
                        copyReviewLink(appointment.review?.reviewToken ?? "", event.currentTarget)
                      }
                      className="px-2 py-1 rounded border border-[color:var(--color-border)] text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface)] transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                )}
                {appointment.review.reviewText && (
                  <div className="mt-2 p-2 bg-[color:var(--color-surface)] rounded border border-[color:var(--color-border)]">
                    <p className="text-xs text-[color:var(--color-muted)] italic">
                      "{appointment.review.reviewText}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-xs sm:text-sm text-[color:var(--color-muted)] pt-3 border-t border-[color:var(--color-border)] space-y-2 bg-[color:var(--color-surface)] sm:bg-[color:var(--color-surface-elevated)] p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 bg-[color:var(--color-primary)]/70 rounded-full flex-shrink-0 mt-1"
                aria-hidden="true"
              />
              <span>
                <strong>Creada:</strong> {new Date(appointment.createdAt).toLocaleString("es-ES")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 bg-[color:var(--color-primary)]/70 rounded-full flex-shrink-0 mt-1"
                aria-hidden="true"
              />
              <span>
                <strong>Actualizada:</strong>{" "}
                {new Date(appointment.updatedAt).toLocaleString("es-ES")}
              </span>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="space-y-3 w-full">
          {/* Quick Actions - Compact */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyBudgetText}
              className="px-3 py-1.5 text-xs bg-[color:var(--color-surface-elevated)] text-[color:var(--color-on-surface)] border border-[color:var(--color-border)] rounded-lg hover:opacity-70 font-medium transition-colors"
            >
              Copiar texto
            </button>
            <button
              type="button"
              onClick={handleExportPng}
              className="px-3 py-1.5 text-xs bg-[color:var(--color-surface-elevated)] text-[color:var(--color-on-surface)] border border-[color:var(--color-border)] rounded-lg hover:opacity-70 font-medium transition-colors"
            >
              Exportar PNG
            </button>
            {appointment.status === "CONFIRMED" && (
              <button
                type="button"
                onClick={() => handleStatusUpdate("COMPLETED")}
                disabled={updateStatusMutation.isPending}
                className="px-3 py-1.5 text-xs bg-[color:var(--color-surface-elevated)] text-[color:var(--color-on-surface)] border border-[color:var(--color-border)] rounded-lg hover:opacity-80 disabled:opacity-50 font-medium transition-colors"
              >
                Marcar Completada
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="px-3 py-1.5 text-xs bg-[color:var(--color-surface-elevated)] text-danger border border-[color:var(--color-border)] rounded-lg hover:bg-danger/5 font-medium transition-colors"
            >
              Eliminar
            </button>
          </div>

          <div />
        </div>
      </ModalFooter>
      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        size="sm"
        ariaLabelledBy="delete-appointment-title"
      >
        <ModalHeader
          title={
            <Typography as="span" id="delete-appointment-title" variant="h4">
              Eliminar cita
            </Typography>
          }
          onClose={() => setIsDeleteOpen(false)}
        />
        <ModalBody>
          <p className="text-sm text-[color:var(--color-muted)]">
            ¿Estás segura de que quieres eliminar esta cita? Esta acción no se puede deshacer.
          </p>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 px-3 py-2 bg-[color:var(--color-surface-elevated)] text-[color:var(--color-on-surface)] border border-[color:var(--color-border)] rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                deleteMutation.mutate(appointment.id, {
                  onSuccess: () => {
                    setIsDeleteOpen(false);
                    onClose();
                  },
                });
              }}
              disabled={deleteMutation.isPending}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Eliminando..." : "Confirmar eliminación"}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </Modal>
  );
}

interface AppointmentDetailFieldProps {
  label: string;
  value: string;
}

function _AppointmentDetailField({ label, value }: AppointmentDetailFieldProps) {
  return (
    <div className="bg-[color:var(--color-surface)] sm:bg-[color:var(--color-surface-elevated)] p-3 rounded-lg border border-[color:var(--color-border)] sm:border-none">
      <div className="block text-xs sm:text-sm font-medium text-[color:var(--color-muted)] mb-1">
        {label}
      </div>
      <p className="text-sm sm:text-base text-[color:var(--color-on-surface)] font-medium">
        {value}
      </p>
    </div>
  );
}
