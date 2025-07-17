import { Appointment, useUpdateAppointmentStatus, useDeleteAppointment } from '@/hooks/useAppointments';
import { getStatusColor, getStatusText, formatDate, formatTime } from '@/utils/appointmentHelpers';

interface AppointmentTableProps {
  appointments: Appointment[];
  highlightedId: string | null;
  onViewDetails: (appointment: Appointment) => void;
}

export default function AppointmentTable({ 
  appointments, 
  highlightedId, 
  onViewDetails 
}: AppointmentTableProps) {
  const updateStatusMutation = useUpdateAppointmentStatus();
  const deleteMutation = useDeleteAppointment();

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

  return (
    <>
      {/* Mobile View */}
      <div className="block lg:hidden space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`bg-white border rounded-xl p-4 transition-all duration-200 ${
              highlightedId === appointment.id 
                ? 'ring-2 ring-[#D4AF37] border-[#D4AF37] shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            {/* Header with Status */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {appointment.clientName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{appointment.clientName}</h3>
                  <p className="text-xs text-gray-500">{appointment.clientEmail}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>
            </div>

            {/* Service and Date */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.586V5L8 4z" />
                </svg>
                <span className="text-sm text-gray-700">{appointment.serviceType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-700">
                  {formatDate(appointment.appointmentDate)} • {formatTime(appointment.appointmentTime)}
                </span>
              </div>
              {appointment.additionalNotes && (
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs text-gray-500 flex-1">{appointment.additionalNotes}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <button
                onClick={() => onViewDetails(appointment)}
                className="text-[#D4AF37] hover:text-[#B8941F] text-sm font-medium"
              >
                Ver detalles
              </button>
              
              <div className="flex items-center space-x-2">
                {appointment.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(appointment.id, 'CONFIRMED')}
                      disabled={updateStatusMutation.isPending}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(appointment.id, 'CANCELLED')}
                      disabled={updateStatusMutation.isPending}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {appointment.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleStatusUpdate(appointment.id, 'COMPLETED')}
                    disabled={updateStatusMutation.isPending}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    Completar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
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
                isHighlighted={highlightedId === appointment.id}
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
    </>
  );
}

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
  return (
    <tr
      id={`appointment-${appointment.id}`}
      className={`hover:bg-gray-50 transition-colors ${
        isHighlighted ? 'bg-yellow-50 border-yellow-200 border-2' : ''
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
        <div className="text-sm text-gray-500">
          {appointment.duration} min • {appointment.location || "A domicilio"}
        </div>
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
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
            appointment.status
          )}`}
        >
          {getStatusText(appointment.status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          {appointment.status === "PENDING" && (
            <>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CONFIRMED")}
                disabled={isUpdating}
                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
              >
                Confirmar
              </button>
              <button
                onClick={() => onStatusUpdate(appointment.id, "CANCELLED")}
                disabled={isUpdating}
                className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
              >
                Cancelar
              </button>
            </>
          )}

          {appointment.status === "CONFIRMED" && (
            <button
              onClick={() => onStatusUpdate(appointment.id, "COMPLETED")}
              disabled={isUpdating}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50"
            >
              Completar
            </button>
          )}

          <button
            onClick={() => onViewDetails(appointment)}
            className="bg-[#D4AF37] text-white px-3 py-1 rounded text-xs hover:bg-[#B8941F]"
          >
            Ver Detalles
          </button>

          <button
            onClick={() => onDelete(appointment.id)}
            disabled={isDeleting}
            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
