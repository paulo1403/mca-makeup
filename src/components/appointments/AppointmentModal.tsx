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
                      ? "En estudio - Room Studio, Pueblo Libre"
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
              <div>
                <div className="text-sm font-semibold text-[#1C1C1C] mb-2 flex items-center space-x-2">
                  <div className="w-4 h-4 bg-[#D4AF37]/70 rounded flex-shrink-0"></div>
                  <span>Notas Adicionales</span>
                </div>
                <p className="text-sm sm:text-base text-gray-900 bg-white sm:bg-gray-50 p-4 rounded-lg leading-relaxed border border-gray-200">
                  {appointment.additionalNotes}
                </p>
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
                  className="px-4 py-3 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[44px]"
                >
                  Confirmar Cita
                </button>
                <button
                  onClick={() => handleStatusUpdate("CANCELLED")}
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-3 bg-rose-400 text-white rounded-lg hover:bg-rose-500 disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[44px]"
                >
                  Cancelar Cita
                </button>
              </div>
            )}
            {appointment.status === "CONFIRMED" && (
              <button
                onClick={() => handleStatusUpdate("COMPLETED")}
                disabled={updateStatusMutation.isPending}
                className="w-full px-4 py-3 bg-sky-400 text-white rounded-lg hover:bg-sky-500 disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[44px]"
              >
                Marcar como Completada
              </button>
            )}

            {/* Secondary Action */}
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-[#1C1C1C] bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition-colors min-h-[44px]"
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
