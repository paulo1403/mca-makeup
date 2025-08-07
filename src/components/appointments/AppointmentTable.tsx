import React from "react";
import {
  Appointment,
  useUpdateAppointmentStatus,
  useDeleteAppointment,
} from "@/hooks/useAppointments";
import {
  getStatusColor,
  getStatusText,
  formatDate,
  formatTime,
  formatPrice,
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
} from "lucide-react";

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

  return (
    <div
      className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
        isHighlighted ? "border-[#D4AF37]/40 bg-[#D4AF37]/5" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#D4AF37]/15 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">
                {appointment.clientName}
                {isHighlighted && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#D4AF37]/20 text-[#B8941F]">
                    Destacada
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600">{appointment.serviceType}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                appointment.status,
              )}`}
            >
              {getStatusText(appointment.status)}
            </span>
            {appointment.status === "COMPLETED" && appointment.review && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                ⭐ Review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#D4AF37]/70" />
            <span className="text-sm text-gray-600">
              {formatDate(appointment.appointmentDate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#D4AF37]/70" />
            <span className="text-sm text-gray-600">
              {formatTime(appointment.appointmentTime)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-[#D4AF37]/70" />
          <span className="text-sm text-gray-600 truncate">
            {appointment.clientEmail}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-[#D4AF37]/70" />
          <span className="text-sm text-gray-600">
            {appointment.clientPhone}
          </span>
        </div>

        {appointment.district && (
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]/70" />
            <span className="text-sm text-gray-600">
              {appointment.district}
            </span>
          </div>
        )}

        {priceInfo.totalPrice > 0 && (
          <div className="bg-[#D4AF37]/10 rounded-lg p-3 border border-[#D4AF37]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-medium text-gray-700">
                  Total:
                </span>
              </div>
              <span className="text-lg font-bold text-[#D4AF37]">
                {formatPrice(priceInfo.totalPrice)}
              </span>
            </div>
            {priceInfo.hasTransport && (
              <div className="text-xs text-gray-600 mt-1">
                Servicio: {formatPrice(priceInfo.servicePrice)} + Movilidad:{" "}
                {formatPrice(priceInfo.transportCost)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50/50 rounded-b-lg">
        <div className="space-y-2">
          {/* Primary Actions */}
          {appointment.status === "PENDING" && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                disabled={isUpdating}
                className="bg-emerald-400 hover:bg-emerald-500 text-white px-3 py-2.5 rounded-lg text-sm disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[40px]"
              >
                Confirmar
              </button>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CANCELLED")}
                disabled={isUpdating}
                className="bg-rose-400 hover:bg-rose-500 text-white px-3 py-2.5 rounded-lg text-sm disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[40px]"
              >
                Cancelar
              </button>
            </div>
          )}

          {appointment.status === "CONFIRMED" && (
            <button
              onClick={() => onStatusUpdate(appointment.id, "COMPLETED")}
              disabled={isUpdating}
              className="w-full bg-sky-400 hover:bg-sky-500 text-white px-3 py-2.5 rounded-lg text-sm disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[40px]"
            >
              Marcar Completada
            </button>
          )}

          {/* Review Link for Completed Appointments */}
          {appointment.status === "COMPLETED" && appointment.review && (
            <button
              onClick={(event) => {
                copyReviewLink(
                  appointment.review!.reviewToken,
                  event.target as HTMLButtonElement,
                );
              }}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center min-h-[40px] space-x-2"
            >
              <span>📋</span>
              <span>Copiar Link Review</span>
            </button>
          )}

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(appointment)}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center min-h-[40px]"
            >
              Ver Detalles
            </button>

            <button
              onClick={() => onDelete(appointment.id)}
              disabled={isDeleting}
              className="bg-slate-400 hover:bg-slate-500 text-white px-3 py-2.5 rounded-lg text-sm disabled:opacity-50 font-medium transition-colors flex items-center justify-center min-h-[40px]"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Desktop Row Component
interface AppointmentRowProps {
  appointment: Appointment;
  isHighlighted: boolean;
  onStatusUpdate: (id: string, status: Appointment["status"]) => void;
  onDelete: (id: string) => void;
  onViewDetails: (appointment: Appointment) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

function AppointmentRow({
  appointment,
  isHighlighted,
  onStatusUpdate,
  onDelete,
  onViewDetails,
  isUpdating,
  isDeleting,
}: AppointmentRowProps) {
  const priceInfo = getPriceBreakdown(appointment);

  return (
    <tr
      id={`appointment-${appointment.id}`}
      className={`hover:bg-gray-50 transition-colors ${
        isHighlighted ? "bg-yellow-50 border-yellow-200 border-2" : ""
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="font-medium text-gray-900 flex items-center">
            {appointment.clientName}
            {isHighlighted && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                📌 Destacada
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">{appointment.clientEmail}</div>
          <div className="text-sm text-gray-500">{appointment.clientPhone}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{appointment.serviceType}</div>
        <div className="text-sm text-gray-500">{appointment.duration} min</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {formatDate(appointment.appointmentDate)}
        </div>
        <div className="text-sm text-gray-500">
          {formatTime(appointment.appointmentTime)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {priceInfo.totalPrice > 0 ? (
          <div>
            <div className="text-sm font-semibold text-[#D4AF37]">
              {formatPrice(priceInfo.totalPrice)}
            </div>
            {priceInfo.hasTransport && (
              <div className="text-xs text-gray-500">
                Servicio: {formatPrice(priceInfo.servicePrice)}
                <br />
                Movilidad: {formatPrice(priceInfo.transportCost)}
              </div>
            )}
            {appointment.district && (
              <div className="text-xs text-gray-500 mt-1">
                📍 {appointment.district}
              </div>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400">No definido</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
              appointment.status,
            )}`}
          >
            {getStatusText(appointment.status)}
          </span>
          {appointment.status === "COMPLETED" && appointment.review && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              ⭐ Review
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex flex-wrap gap-2">
          {appointment.status === "PENDING" && (
            <>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                disabled={isUpdating}
                className="bg-emerald-400 text-white px-3 py-2 rounded-lg text-xs hover:bg-emerald-500 disabled:opacity-50 font-medium transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CANCELLED")}
                disabled={isUpdating}
                className="bg-rose-400 text-white px-3 py-2 rounded-lg text-xs hover:bg-rose-500 disabled:opacity-50 font-medium transition-colors"
              >
                Cancelar
              </button>
            </>
          )}

          {appointment.status === "CONFIRMED" && (
            <button
              onClick={() => onStatusUpdate(appointment.id, "COMPLETED")}
              disabled={isUpdating}
              className="bg-sky-400 text-white px-3 py-2 rounded-lg text-xs hover:bg-sky-500 disabled:opacity-50 font-medium transition-colors"
            >
              Completar
            </button>
          )}

          <button
            onClick={() => onViewDetails(appointment)}
            className="bg-[#D4AF37] text-white px-3 py-2 rounded-lg text-xs hover:bg-[#B8941F] font-medium transition-colors"
          >
            Ver Detalles
          </button>

          {appointment.status === "COMPLETED" && appointment.review && (
            <button
              onClick={(event) => {
                copyReviewLink(
                  appointment.review!.reviewToken,
                  event.target as HTMLButtonElement,
                );
              }}
              className="bg-purple-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-purple-600 font-medium transition-colors"
            >
              📋 Link Review
            </button>
          )}

          <button
            onClick={() => onDelete(appointment.id)}
            disabled={isDeleting}
            className="bg-slate-400 text-white px-3 py-2 rounded-lg text-xs hover:bg-slate-500 disabled:opacity-50 font-medium transition-colors"
          >
            Eliminar
          </button>
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

  if (appointments.length === 0) {
    return null; // El estado vacío se maneja en el componente padre
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
    <div className="overflow-x-auto bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Servicio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha & Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
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
