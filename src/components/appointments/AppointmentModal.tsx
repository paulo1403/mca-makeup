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
      <div className="bg-white rounded-t-xl sm:rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b sm:border-b-0">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-bold text-[#1C1C1C]">
              Detalles de la Cita
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 -m-2 rounded-full hover:bg-gray-100"
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

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
                  Ubicación
                </label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-900 font-medium mb-2">
                    {appointment.location || "A domicilio"}
                  </p>
                  {appointment.address && (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700">
                        📍 {appointment.address}
                        {appointment.addressReference &&
                          ` (${appointment.addressReference})`}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={(event) => {
                            const fullAddress = `${appointment.address}${appointment.district ? `, ${appointment.district}` : ""}, Lima, Perú`;
                            navigator.clipboard.writeText(fullAddress);
                            // Mostrar feedback visual (opcional)
                            const btn = event.target as HTMLButtonElement;
                            const originalText = btn.textContent;
                            btn.textContent = "✅ Copiado!";
                            setTimeout(() => {
                              btn.textContent = originalText;
                            }, 2000);
                          }}
                          className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          📋 Copiar Dirección
                        </button>
                        <button
                          onClick={() => {
                            const fullAddress = `${appointment.address}${appointment.district ? `, ${appointment.district}` : ""}, Lima, Perú`;
                            const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}`;
                            window.open(mapsUrl, "_blank");
                          }}
                          className="flex items-center justify-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          🗺️ Abrir en Google Maps
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
                  <div className="bg-[#D4AF37]/10 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Información de Precios
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Servicio
                        </label>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(priceInfo.servicePrice)}
                        </p>
                      </div>
                      {priceInfo.hasTransport && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Movilidad
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPrice(priceInfo.transportCost)}
                          </p>
                          {appointment.district && (
                            <p className="text-xs text-gray-500 mt-1">
                              📍 {appointment.district}
                            </p>
                          )}
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Total
                        </label>
                        <p className="text-xl font-bold text-[#D4AF37]">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-3 sm:p-4 rounded-lg leading-relaxed">
                  {appointment.additionalNotes}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t">
              <span className="text-sm font-medium text-gray-700">Estado:</span>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                  appointment.status,
                )}`}
              >
                {getStatusText(appointment.status)}
              </span>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 pt-3 border-t space-y-1">
              <p>
                📅 Creada:{" "}
                {new Date(appointment.createdAt).toLocaleString("es-ES")}
              </p>
              <p>
                🔄 Actualizada:{" "}
                {new Date(appointment.updatedAt).toLocaleString("es-ES")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t bg-white p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-3 sm:py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cerrar
            </button>
            {appointment.status === "PENDING" && (
              <>
                <button
                  onClick={() => handleStatusUpdate("CONFIRMED")}
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  ✅ Confirmar Cita
                </button>
                <button
                  onClick={() => handleStatusUpdate("CANCELLED")}
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-3 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                >
                  ❌ Cancelar Cita
                </button>
              </>
            )}
            {appointment.status === "CONFIRMED" && (
              <button
                onClick={() => handleStatusUpdate("COMPLETED")}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                ✅ Marcar como Completada
              </button>
            )}
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
    <div className="bg-gray-50 p-3 rounded-lg">
      <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <p className="text-sm sm:text-base text-gray-900 font-medium">{value}</p>
    </div>
  );
}
