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
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          No se encontraron citas
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
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
    </div>
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
