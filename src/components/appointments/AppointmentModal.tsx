import {
  Appointment,
  useUpdateAppointmentStatus,
} from "@/hooks/useAppointments";
import {
  getStatusColor,
  getStatusText,
  formatDate,
  formatTime,
  formatPrice,
  getPriceBreakdown,
} from "@/utils/appointmentHelpers";
import {
  copyReviewLink,
  getReviewUrl,
  getReviewStatusColor,
  getReviewStatusText,
} from "@/utils/reviewHelpers";

interface AppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentModal({
  appointment,
  isOpen,
  onClose,
}: AppointmentModalProps) {
  const updateStatusMutation = useUpdateAppointmentStatus();

  if (!isOpen || !appointment) {
    return null;
  }

  const handleStatusUpdate = (status: Appointment["status"]) => {
    updateStatusMutation.mutate({ id: appointment.id, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col shadow-2xl">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 rounded-t-2xl sm:rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-bold text-[#1C1C1C] font-playfair">
              Detalles de la Cita
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-[#D4AF37] p-2 -m-2 rounded-full hover:bg-[#D4AF37]/5 transition-colors"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 sm:bg-white">
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <AppointmentDetailField
                label="Cliente"
                value={appointment.clientName}
              />
              <AppointmentDetailField
                label="Email"
                value={appointment.clientEmail}
              />
              <AppointmentDetailField
                label="Teléfono"
                value={appointment.clientPhone}
              />
              <AppointmentDetailField
                label="Servicio"
                value={appointment.serviceType}
              />
              <AppointmentDetailField
                label="Fecha"
                value={formatDate(appointment.appointmentDate)}
              />
              <AppointmentDetailField
                label="Hora"
                value={formatTime(appointment.appointmentTime)}
              />
              <AppointmentDetailField
                label="Duración"
                value={`${appointment.duration} minutos`}
              />
              <div>
                <div className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  Ubicación
                </div>
                <div className="bg-white sm:bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm sm:text-base text-gray-900 font-medium mb-2">
                    {appointment.location &&
                    appointment.location.includes("Studio")
                      ? "En estudio - Av. Bolívar 1073, Pueblo Libre"
                      : "Servicio a domicilio"}
                  </p>
                  {appointment.address && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700 flex items-start space-x-2">
                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                        <span>
                          {appointment.address}
                          {appointment.addressReference &&
                            ` (${appointment.addressReference})`}
                          {appointment.district && `, ${appointment.district}`}
                        </span>
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(event) => {
                            const fullAddress = `${appointment.address}${appointment.district ? `, ${appointment.district}` : ""}, Lima, Perú`;
                            navigator.clipboard.writeText(fullAddress);
                            const btn = event.target as HTMLButtonElement;
                            const originalText = btn.textContent;
                            btn.textContent = "✅ Copiado!";
                            setTimeout(() => {
                              btn.textContent = originalText;
                            }, 2000);
                          }}
                          className="flex items-center justify-center gap-2 bg-[#D4AF37]/20 text-[#B8941F] px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[#D4AF37]/30 transition-colors border border-[#D4AF37]/30"
                        >
                          Copiar Dirección
                        </button>
                        <button
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
              </div>
            </div>

            {/* Información de Precios */}
            {(() => {
              const priceInfo = getPriceBreakdown(appointment);
              if (priceInfo.totalPrice > 0) {
                return (
                  <div className="bg-[#D4AF37]/5 p-4 rounded-lg border border-[#D4AF37]/20">
                    <h3 className="text-sm font-semibold text-[#1C1C1C] mb-3 flex items-center space-x-2">
                      <div className="w-4 h-4 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                      <span>Información de Precios</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="block text-xs font-medium text-gray-600 mb-1">
                          Servicio
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-gray-900">
                          {formatPrice(priceInfo.servicePrice)}
                        </p>
                      </div>
                      {priceInfo.hasTransport && (
                        <div className="bg-white p-3 rounded-lg">
                          <div className="block text-xs font-medium text-gray-600 mb-1">
                            Movilidad
                          </div>
                          <p className="text-base sm:text-lg font-semibold text-gray-900">
                            {formatPrice(priceInfo.transportCost)}
                          </p>
                          {appointment.district && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                              <div className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                              <span>{appointment.district}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {priceInfo.hasNightShift && (
                        <div className="bg-slate-50 p-3 rounded-lg">
                          <div className="block text-xs font-medium text-gray-600 mb-1">
                            Costo Nocturno
                          </div>
                          <p className="text-base sm:text-lg font-semibold text-gray-900">
                            {formatPrice(priceInfo.nightShiftCost)}
                          </p>
                          <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                            <span>7:30 PM - 6:00 AM</span>
                          </div>
                        </div>
                      )}
                      <div className="bg-[#D4AF37] text-white p-3 rounded-lg">
                        <div className="block text-xs font-medium text-white/80 mb-1">
                          Total
                        </div>
                        <p className="text-lg sm:text-xl font-bold">
                          {formatPrice(priceInfo.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {appointment.additionalNotes && (
              <div className="space-y-3">
                {appointment.additionalNotes
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line, index) => {
                    // Detectar si la línea parece ser un título o encabezado
                    const isHeader =
                      line.includes(":") && line.split(":")[1].trim() !== "";
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
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            {isServiceInfo && (
                              <svg
                                className="w-4 h-4 text-[#D4AF37] flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
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
                                className="w-4 h-4 text-[#D4AF37] flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
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
                                className="w-4 h-4 text-[#D4AF37] flex-shrink-0"
                                fill="none"
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
                            <span className="text-sm font-medium text-gray-600">
                              {label.trim()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 leading-relaxed break-words">
                              {value}
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700 leading-relaxed flex-1">
                            {line.trim()}
                          </p>
                        </div>
                      );
                    }
                  })}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
              <div className="text-sm font-semibold text-[#1C1C1C] flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                <span>Estado actual:</span>
              </div>
              <span
                className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(
                  appointment.status,
                )}`}
              >
                {getStatusText(appointment.status)}
              </span>
            </div>

            {/* Review Link Section - Only show if appointment is completed and has review */}
            {appointment.status === "COMPLETED" && appointment.review && (
              <div className="bg-[#D4AF37]/5 p-4 rounded-lg border border-[#D4AF37]/20">
                <h3 className="text-sm font-semibold text-[#1C1C1C] mb-3 flex items-center space-x-2">
                  <div className="w-4 h-4 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                  <span>Link de Reseña</span>
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-[#D4AF37]/30">
                    <div className="text-xs font-medium text-gray-600 mb-2">
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
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < appointment.review!.rating! ? "text-[#D4AF37] fill-current" : "text-gray-300"}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({appointment.review.rating}/5)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-[#D4AF37]/30">
                    <div className="text-xs font-medium text-gray-600 mb-2">
                      Link para compartir con la clienta
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1 bg-gray-50 p-2 rounded border text-sm text-gray-700 font-mono break-all">
                        {getReviewUrl(appointment.review.reviewToken)}
                      </div>
                      <button
                        onClick={(event) => {
                          copyReviewLink(
                            appointment.review!.reviewToken,
                            event.target as HTMLButtonElement,
                          );
                        }}
                        className="px-3 py-2 bg-[#D4AF37] text-white rounded text-sm font-medium hover:bg-[#B8941F] transition-colors whitespace-nowrap"
                      >
                        📋 Copiar Link
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Comparte este link con {appointment.clientName} para que
                      pueda dejar su reseña del servicio.
                    </div>
                  </div>

                  {appointment.review.reviewText && (
                    <div className="bg-white p-3 rounded-lg border border-[#D4AF37]/30">
                      <div className="text-xs font-medium text-gray-600 mb-2">
                        Comentario de la clienta
                      </div>
                      <p className="text-sm text-gray-700 italic">
                        &ldquo;{appointment.review.reviewText}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-xs sm:text-sm text-gray-500 pt-3 border-t border-gray-200 space-y-2 bg-white sm:bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#D4AF37]/70 rounded-full flex-shrink-0 mt-1"></div>
                <span>
                  <strong>Creada:</strong>{" "}
                  {new Date(appointment.createdAt).toLocaleString("es-ES")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#D4AF37]/70 rounded-full flex-shrink-0 mt-1"></div>
                <span>
                  <strong>Actualizada:</strong>{" "}
                  {new Date(appointment.updatedAt).toLocaleString("es-ES")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-200 bg-white p-4 sm:p-6 rounded-b-2xl sm:rounded-b-xl">
          <div className="space-y-3">
            {/* Primary Actions */}
            {appointment.status === "PENDING" && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleStatusUpdate("CONFIRMED")}
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-3 bg-success text-on-success rounded-lg hover:opacity-90 disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[44px]"
                >
                  Confirmar Cita
                </button>
                <button
                  onClick={() => handleStatusUpdate("CANCELLED")}
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-3 bg-danger text-on-danger rounded-lg hover:opacity-90 disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[44px]"
                >
                  Cancelar Cita
                </button>
              </div>
            )}
            {appointment.status === "CONFIRMED" && (
              <button
                onClick={() => handleStatusUpdate("COMPLETED")}
                disabled={updateStatusMutation.isPending}
                className="w-full px-4 py-3 bg-info text-on-info rounded-lg hover:opacity-90 disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[44px]"
              >
                Marcar como Completada
              </button>
            )}

            {/* Secondary Action */}
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-card text-main border border-border rounded-lg hover:bg-muted/10 font-medium transition-colors min-h-[44px]"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AppointmentDetailFieldProps {
  label: string;
  value: string;
}

function AppointmentDetailField({ label, value }: AppointmentDetailFieldProps) {
  return (
    <div className="bg-white sm:bg-gray-50 p-3 rounded-lg border border-gray-200 sm:border-none">
      <div className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
        {label}
      </div>
      <p className="text-sm sm:text-base text-[#1C1C1C] font-medium">{value}</p>
    </div>
  );
}
