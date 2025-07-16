import { Appointment, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { getStatusColor, getStatusText, formatDate, formatTime } from '@/utils/appointmentHelpers';

interface AppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentModal({ appointment, isOpen, onClose }: AppointmentModalProps) {
  const updateStatusMutation = useUpdateAppointmentStatus();

  if (!isOpen || !appointment) {
    return null;
  }

  const handleStatusUpdate = (status: Appointment["status"]) => {
    updateStatusMutation.mutate({ id: appointment.id, status });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1C1C1C]">
              Detalles de la Cita
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
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

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppointmentDetailField label="Cliente" value={appointment.clientName} />
              <AppointmentDetailField label="Email" value={appointment.clientEmail} />
              <AppointmentDetailField label="Teléfono" value={appointment.clientPhone} />
              <AppointmentDetailField label="Servicio" value={appointment.serviceType} />
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
              <AppointmentDetailField 
                label="Ubicación" 
                value={appointment.location || "A domicilio"} 
              />
            </div>

            {appointment.additionalNotes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Adicionales
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {appointment.additionalNotes}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-4 pt-4">
              <span className="text-sm font-medium text-gray-700">Estado:</span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  appointment.status
                )}`}
              >
                {getStatusText(appointment.status)}
              </span>
            </div>

            <div className="text-sm text-gray-500 pt-4 border-t">
              <p>
                Creada: {new Date(appointment.createdAt).toLocaleString("es-ES")}
              </p>
              <p>
                Actualizada: {new Date(appointment.updatedAt).toLocaleString("es-ES")}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cerrar
            </button>
            {appointment.status === "PENDING" && (
              <>
                <button
                  onClick={() => handleStatusUpdate("CONFIRMED")}
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Confirmar Cita
                </button>
                <button
                  onClick={() => handleStatusUpdate("CANCELLED")}
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Cancelar Cita
                </button>
              </>
            )}
            {appointment.status === "CONFIRMED" && (
              <button
                onClick={() => handleStatusUpdate("COMPLETED")}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Marcar como Completada
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
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <p className="text-gray-900">{value}</p>
    </div>
  );
}
