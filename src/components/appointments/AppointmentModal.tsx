"use client";
import StatusBadge from "@/components/appointments/StatusBadge";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "@/components/ui/Modal";
import Typography from "@/components/ui/Typography";
import {
  type Appointment,
  useDeleteAppointment,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import { formatDate, formatPrice, formatTime, getPriceBreakdown } from "@/utils/appointmentHelpers";
import {
  copyReviewLink,
  getReviewStatusColor,
  getReviewStatusText,
  getReviewUrl,
} from "@/utils/reviewHelpers";
import { generateQuotePng, copyQuotePngToClipboard, buildQuoteText } from "@/components/share/QuoteShareCard";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

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
            <div className="bg-[color:var(--color-surface)] p-4 rounded-xl border border-[color:var(--color-border)]">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-[color:var(--color-heading)]">
                    {appointment.clientName}
                  </div>
                  <div className="text-sm text-[color:var(--color-muted)]">
                    {appointment.clientEmail} · {appointment.clientPhone}
                  </div>
                  <div className="text-sm text-[color:var(--color-on-surface)] font-medium">
                    {appointment.serviceType}
                  </div>
                  <div className="text-sm text-[color:var(--color-muted)]">
                    {formatDate(appointment.appointmentDate)} · {formatTime(appointment.appointmentTime)} · {appointment.duration} min
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={appointment.status} className="text-xs px-2 py-1 font-semibold" />
                </div>
              </div>
            </div>

            <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]">
              <button type="button" onClick={() => setShowLocation((v) => !v)} className="w-full flex items-center justify-between px-4 py-3">
                <span className="text-sm font-semibold text-[color:var(--color-on-surface)]">Ubicación</span>
                <span className="text-xs text-[color:var(--color-muted)]">{showLocation ? "Ocultar" : "Mostrar"}</span>
              </button>
              {showLocation && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-[color:var(--color-on-surface)] font-medium">
                    {appointment.location?.includes("Studio") ? "En estudio - Av. Bolívar 1073, Pueblo Libre" : "Servicio a domicilio"}
                  </p>
                  {appointment.address && (
                    <div className="space-y-3">
                      <p className="text-sm text-[color:var(--color-muted)]">
                        {appointment.address}
                        {appointment.addressReference && ` (${appointment.addressReference})`}
                        {appointment.district && `, ${appointment.district}`}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
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
                          className="flex items-center justify-center gap-2 bg-[color:var(--color-accent-secondary)]/10 text-[color:var(--color-accent-secondary)] px-3 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-colors border border-[color:var(--color-border)]"
                        >
                          Copiar Dirección
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const fullAddress = `${appointment.address}${appointment.district ? `, ${appointment.district}` : ""}, Lima, Perú`;
                            const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}`;
                            window.open(mapsUrl, "_blank");
                          }}
                          className="flex items-center justify-center gap-2 bg-emerald-400 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-500 transition-colors"
                        >
                          Abrir en Maps
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
                <div className="bg-[color:var(--color-surface)] p-4 rounded-xl border border-[color:var(--color-border)] space-y-3">
                  <div className="text-sm font-semibold text-[color:var(--color-on-surface)]">Precios</div>
                  {appointment.services && appointment.services.length > 0 && (
                    <div className="space-y-2">
                      {appointment.services.map((s) => (
                        <div key={s.id} className="flex items-center justify-between text-sm">
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
                  <div className="border-t border-[color:var(--color-border)] pt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[color:var(--color-muted)]">Servicios</span>
                      <span className="text-[color:var(--color-on-surface)]">{formatPrice(priceInfo.servicePrice)}</span>
                    </div>
                    {priceInfo.hasTransport && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[color:var(--color-muted)]">Movilidad</span>
                        <span className="text-[color:var(--color-on-surface)]">{formatPrice(priceInfo.transportCost)}</span>
                      </div>
                    )}
                    {priceInfo.hasNightShift && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[color:var(--color-muted)]">Costo nocturno</span>
                        <span className="text-[color:var(--color-on-surface)]">{formatPrice(priceInfo.nightShiftCost)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between font-serif text-lg">
                      <span className="text-[color:var(--color-heading)]">Total</span>
                      <span className="text-[color:var(--color-primary)] font-bold">{formatPrice(priceInfo.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}

          {appointment.additionalNotes && (
            <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]">
              <button type="button" onClick={() => setShowNotes((v) => !v)} className="w-full flex items-center justify-between px-4 py-3">
                <span className="text-sm font-semibold text-[color:var(--color-on-surface)]">Notas</span>
                <span className="text-xs text-[color:var(--color-muted)]">{showNotes ? "Ocultar" : "Mostrar"}</span>
              </button>
              {showNotes && (
                <div className="px-4 pb-4 space-y-3">
                  {appointment.additionalNotes
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((line, index) => {
                    const isHeader = line.includes(":") && line.split(":")[1].trim() !== "";
                    const isServiceInfo =
                      line.toLowerCase().includes("servicio") ||
                      line.toLowerCase().includes("maquillaje") ||
                      line.toLowerCase().includes("peinado");
                    const isLocationInfo =
                      line.toLowerCase().includes("ubicación") ||
                      line.toLowerCase().includes("dirección") ||
                    line.toLowerCase().includes("local");

                  if (isHeader) {
                    const [label, ...valueParts] = line.split(":");
                    const value = valueParts.join(":").trim();

                    return (
                      <div
                        key={line}
                        className="flex items-start space-x-3 p-4 bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)] shadow-sm"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          {isServiceInfo && (
                            <svg
                              className="w-4 h-4 text-[color:var(--color-accent)] flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          )}
                          {isLocationInfo && (
                            <svg
                              className="w-4 h-4 text-[color:var(--color-accent)] flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                          {!isServiceInfo && !isLocationInfo && (
                            <svg
                              className="w-4 h-4 text-[color:var(--color-accent)] flex-shrink-0"
                              fill="none"
                              aria-hidden="true"
                              focusable="false"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                          <span className="text-sm font-medium text-[color:var(--color-muted)]">
                            {label.trim()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[color:var(--color-on-surface)] leading-relaxed break-words">
                            {value}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={line}
                      className="flex items-start space-x-3 p-4 bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)] shadow-sm"
                    >
                      <div className="w-2 h-2 bg-[color:var(--color-muted)] rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-[color:var(--color-muted)] leading-relaxed flex-1">
                        {line.trim()}
                      </p>
                    </div>
                  );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-[color:var(--color-border)]">
            <div className="text-sm font-semibold text-[color:var(--color-on-surface)] flex items-center space-x-2">
              <div
                className="w-3 h-3 bg-[color:var(--color-primary)] rounded-full flex-shrink-0"
                aria-hidden="true"
              />
              <span>Estado actual:</span>
            </div>
            <StatusBadge status={appointment.status} className="text-sm px-3 py-2 font-semibold" />
          </div>

          {appointment.status === "COMPLETED" && appointment.review && (
            <div className="bg-[color:var(--color-surface-elevated)] p-4 rounded-lg border border-[color:var(--color-border)]">
              <h3 className="text-sm font-semibold text-[color:var(--color-on-surface)] mb-3 flex items-center space-x-2">
                <div
                  className="w-4 h-4 bg-[color:var(--color-primary)] rounded-full flex-shrink-0"
                  aria-hidden="true"
                />
                <span>Link de Reseña</span>
              </h3>
              <div className="space-y-3">
                <div className="bg-[color:var(--color-surface)] p-3 rounded-lg border border-[color:var(--color-border)]">
                  <div className="text-xs font-medium text-[color:var(--color-muted)] mb-2">
                    Estado de la reseña
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getReviewStatusColor(appointment.review.status)}`}
                    >
                      {getReviewStatusText(appointment.review.status)}
                    </span>
                    {appointment.review.rating && (
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={`star-${star}`}
                            className={`w-4 h-4 ${star <= (appointment.review?.rating ?? 0) ? "text-[color:var(--color-primary)] fill-current" : "text-[color:var(--color-border)]"}`}
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm text-[color:var(--color-muted)] ml-1">
                          ({appointment.review.rating}/5)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[color:var(--color-surface)] p-3 rounded-lg border border-[color:var(--color-border)]">
                  <div className="text-xs font-medium text-[color:var(--color-muted)] mb-2">
                    Link para compartir con la clienta
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 bg-[color:var(--color-surface-elevated)] p-2 rounded border border-[color:var(--color-border)] text-sm text-[color:var(--color-on-surface)] font-mono break-all">
                      {getReviewUrl(appointment.review.reviewToken)}
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        const token = appointment.review?.reviewToken;
                        if (!token) return;
                        copyReviewLink(token, event.currentTarget as HTMLButtonElement);
                      }}
                      className="px-3 py-2 bg-[color:var(--color-accent-secondary)] text-[color:var(--color-on-accent-contrast)] rounded text-sm font-medium hover:opacity-90 transition-colors whitespace-nowrap"
                    >
                      Copiar enlace
                    </button>
                  </div>
                  <div className="text-xs text-[color:var(--color-muted)] mt-2">
                    Comparte este link con {appointment.clientName} para que pueda dejar su reseña
                    del servicio.
                  </div>
                </div>

                {appointment.review.reviewText && (
                  <div className="bg-[color:var(--color-surface)] p-3 rounded-lg border border-[color:var(--color-border)]">
                    <div className="text-xs font-medium text-[color:var(--color-muted)] mb-2">
                      Comentario de la clienta
                    </div>
                    <p className="text-sm text-[color:var(--color-muted)] italic">
                      &ldquo;{appointment.review.reviewText}&rdquo;
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
        <div className="space-y-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleCopyBudgetText}
              className="px-4 py-3 bg-[color:var(--color-surface-elevated)] text-[color:var(--color-on-surface)] border border-[color:var(--color-border)] rounded-lg hover:opacity-90 text-sm font-medium min-h-[44px]"
            >
              Copiar texto
            </button>
            <button
              type="button"
              onClick={handleExportPng}
              className="px-4 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium transition-colors min-h-[44px]"
            >
              Exportar PNG
            </button>
            {appointment.status === "CONFIRMED" && (
              <button
                type="button"
                onClick={() => handleStatusUpdate("COMPLETED")}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-3 bg-[color:var(--color-cta-bg)] text-[color:var(--color-cta-text)] rounded-lg hover:bg-[color:var(--color-cta-hover)] disabled:opacity-50 font-medium transition-colors min-h-[44px]"
              >
                Marcar Completada
              </button>
            )}
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

function AppointmentDetailField({ label, value }: AppointmentDetailFieldProps) {
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
