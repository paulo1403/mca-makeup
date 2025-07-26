import { CalendarEvent } from '@/utils/calendarEvents';
import { User, Phone, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getStatusBadge } from '@/utils/calendarStatus';
import React from 'react';

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
  const config = getStatusBadge(appointment.resource.status);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Detalles de la Cita</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl md:text-base"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{appointment.resource.clientName}</p>
                <p className="text-sm text-gray-600">{appointment.resource.clientEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <p className="text-gray-900">{appointment.resource.clientPhone}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900">
                  {format(appointment.start, 'EEEE, d MMMM yyyy', { locale: es })}
                </p>
                <p className="text-sm text-gray-600">
                  {format(appointment.start, 'HH:mm')} - {format(appointment.end, 'HH:mm')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900">{appointment.resource.service}</p>
                <p className="text-sm font-medium text-[#D4AF37]">S/ {appointment.resource.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>{config.label}</span>
              </div>
            </div>
            {appointment.resource.notes && (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Notas:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{appointment.resource.notes}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-6 pt-4 border-t">
            {appointment.resource.status === 'PENDING' && (
              <button
                onClick={() => onUpdateStatus(appointment.resource.id, 'CONFIRMED')}
                disabled={isUpdating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm w-full sm:w-auto flex items-center justify-center"
              >
                {isUpdating ? 'Confirmando...' : 'Confirmar'}
              </button>
            )}
            {(appointment.resource.status === 'PENDING' || appointment.resource.status === 'CONFIRMED') && (
              <button
                onClick={() => onUpdateStatus(appointment.resource.id, 'COMPLETED')}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm w-full sm:w-auto flex items-center justify-center"
              >
                {isUpdating ? 'Procesando...' : 'Marcar Completada'}
              </button>
            )}
            {appointment.resource.status !== 'CANCELLED' && appointment.resource.status !== 'COMPLETED' && (
              <button
                onClick={() => onUpdateStatus(appointment.resource.id, 'CANCELLED')}
                disabled={isUpdating}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm w-full sm:w-auto flex items-center justify-center"
              >
                {isUpdating ? 'Cancelando...' : 'Cancelar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
