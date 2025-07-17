import Link from 'next/link';
import { ArrowRight, User, Calendar } from 'lucide-react';
import { type RecentAppointment } from '@/hooks/useRecentAppointments';
import { useIsSmallMobile } from '@/hooks/useMediaQuery';
import { 
  formatDateTime, 
  getStatusColor, 
  getStatusText, 
  getClientInitials 
} from '@/utils/dashboardUtils';

interface AppointmentItemProps {
  appointment: RecentAppointment;
}

function AppointmentItem({ appointment }: AppointmentItemProps) {
  const statusColor = getStatusColor(appointment.status);
  const statusText = getStatusText(appointment.status);
  const initials = getClientInitials(appointment.clientName);
  const isSmallScreen = useIsSmallMobile();

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 touch-target">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-[#D4AF37] font-semibold text-sm sm:text-base">
            {initials}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
            {appointment.clientName}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 truncate">
            {appointment.serviceType}
          </p>
          {isSmallScreen ? (
            // Stack date and time on mobile for better readability
            <div className="text-xs text-gray-500 mt-1 space-y-1">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-1">
              {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusColor}`}>
          {isSmallScreen ? statusText.substring(0, 4) : statusText}
        </span>
        <Link
          href="/admin/appointments"
          className="text-[#D4AF37] hover:text-[#B8941F] text-xs sm:text-sm font-medium p-1 touch-target focus-ring rounded"
        >
          Ver
        </Link>
      </div>
    </div>
  );
}

interface RecentAppointmentsProps {
  appointments: RecentAppointment[];
  isLoading?: boolean;
}

export default function RecentAppointments({ appointments, isLoading }: RecentAppointmentsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-[#1C1C1C]">Citas Recientes</h2>
        </div>
        <div className="p-6 sm:p-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[#1C1C1C]">Citas Recientes</h2>
        <Link
          href="/admin/appointments"
          className="flex items-center space-x-1 text-[#D4AF37] hover:text-[#B8941F] font-medium text-sm group"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="p-6 sm:p-8 text-center">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm sm:text-base">No hay citas recientes</p>
          <Link
            href="/admin/appointments"
            className="inline-block mt-3 text-[#D4AF37] hover:text-[#B8941F] text-sm font-medium"
          >
            Ver todas las citas
          </Link>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <AppointmentItem key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
