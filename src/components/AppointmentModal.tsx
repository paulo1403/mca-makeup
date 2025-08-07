import { CalendarEvent } from "@/utils/calendarEvents";
import {
  User,
  Phone,
  Clock,
  MapPin,
  X,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getStatusConfig } from "@/utils/calendarStatus";
import React from "react";

interface AppointmentModalProps {
  appointment: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  isUpdating?: boolean;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onUpdateStatus,
  isUpdating = false,
}) => {
  if (!isOpen || !appointment) return null;

  const statusConfig = getStatusConfig(appointment.resource.status);
  const serviceType =
    appointment.resource.service || "Servicio no especificado";

  const getStatusLabel = (status: string) => {
    const labels = {
      PENDING: "Pendiente",
      CONFIRMED: "Confirmada",
      COMPLETED: "Completada",
      CANCELLED: "Cancelada",
    };
    return labels[status as keyof typeof labels] || "Desconocido";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1C1C1C] to-[#2A2A2A] p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${statusConfig.dot}`}></div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  Detalles de la Cita
                </h3>
                <p className="text-sm text-gray-300">
                  {getStatusLabel(appointment.resource.status)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-4">
            {/* Cliente */}
            <div
              className={`${statusConfig.bg} ${statusConfig.border} border rounded-lg p-4`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${statusConfig.bg}`}>
                  <User className={`w-5 h-5 ${statusConfig.text}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-base md:text-lg">
                    {appointment.resource.clientName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {appointment.resource.clientEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Teléfono */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white">
                  <Phone className="w-5 h-5 text-[#B06579]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium text-gray-900">
                    {appointment.resource.clientPhone}
                  </p>
                </div>
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-white">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha y Hora</p>
                  <p className="font-medium text-gray-900">
                    {format(appointment.start, "EEEE, d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(appointment.start, "HH:mm")} -{" "}
                    {format(appointment.end, "HH:mm")}
                  </p>
                </div>
              </div>
            </div>

            {/* Servicio y Precio */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-white">
                  <MapPin className="w-5 h-5 text-[#5A5A5A]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Servicio</p>
                  <p className="font-medium text-gray-900">{serviceType}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-lg font-semibold text-[#D4AF37]">
                      S/ {appointment.resource.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-white">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2`}
                      ></div>
                      {getStatusLabel(appointment.resource.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notas */}
            {appointment.resource.notes && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-white">
                    <FileText className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      Notas adicionales
                    </p>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {appointment.resource.notes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
          <div className="flex flex-col space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {appointment.resource.status === "PENDING" && (
                <button
                  onClick={() =>
                    onUpdateStatus(appointment.resource.id, "CONFIRMED")
                  }
                  disabled={isUpdating}
                  className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>
                    {isUpdating ? "Confirmando..." : "Confirmar Cita"}
                  </span>
                </button>
              )}

              {(appointment.resource.status === "PENDING" ||
                appointment.resource.status === "CONFIRMED") && (
                <button
                  onClick={() =>
                    onUpdateStatus(appointment.resource.id, "COMPLETED")
                  }
                  disabled={isUpdating}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>
                    {isUpdating ? "Procesando..." : "Marcar Completada"}
                  </span>
                </button>
              )}
            </div>

            {appointment.resource.status !== "CANCELLED" &&
              appointment.resource.status !== "COMPLETED" && (
                <button
                  onClick={() =>
                    onUpdateStatus(appointment.resource.id, "CANCELLED")
                  }
                  disabled={isUpdating}
                  className="w-full px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>{isUpdating ? "Cancelando..." : "Cancelar Cita"}</span>
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
