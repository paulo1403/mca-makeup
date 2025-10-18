import Link from "next/link";
import { ArrowRight, User, Calendar, Clock } from "lucide-react";
import { type RecentAppointment } from "@/hooks/useRecentAppointments";
import { useIsSmallMobile } from "@/hooks/useMediaQuery";
import {
  formatDate,
  formatTime,
  formatServices,
  getStatusColor,
  getStatusText,
  getClientInitials,
} from "@/utils/dashboardUtils";

interface AppointmentItemProps {
  appointment: RecentAppointment;
}

function AppointmentItem({ appointment }: AppointmentItemProps) {
  const statusColor = getStatusColor(appointment.status);
  const statusText = getStatusText(appointment.status);
  const initials = getClientInitials(appointment.clientName);
  const isSmallScreen = useIsSmallMobile();

  if (isSmallScreen) {
    return (
      <div className="bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)]/30 shadow-sm hover:shadow-md transition-all duration-200 appointment-card-mobile">
        {/* Header with avatar and name */}
        <div className="flex items-center space-x-3 p-3 border-b border-[color:var(--color-border)]/20">
          <div className="w-9 h-9 bg-[color:var(--color-primary)]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[color:var(--color-primary)] font-semibold text-sm">
              {initials}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[color:var(--color-heading)] text-sm truncate">
              {appointment.clientName}
            </p>
            <div className="text-xs text-[color:var(--color-muted)] truncate">
              {formatServices(appointment).map((service, index) => (
                <span key={index} className="inline-flex items-center">
                  {service.displayText}
                  {service.quantity > 1 && (
                    <span className="ml-1 inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]">
                      {service.quantity}
                    </span>
                  )}
                  {index < formatServices(appointment).length - 1 && (
                    <span className="mx-1 text-[color:var(--color-muted)]/60">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Details section */}
        <div className="p-3 space-y-2 appointment-details-mobile">
          <div className="flex items-center space-x-2 text-xs text-[color:var(--color-body)]">
            <Calendar className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
            <span>{formatDate(appointment.appointmentDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-[color:var(--color-body)]">
            <Clock className="w-3.5 h-3.5 text-[color:var(--color-muted)]" />
            <span>{formatTime(appointment.appointmentTime)}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusColor}`}
            >
              {statusText}
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="px-3 pb-3">
          <Link
            href="/admin/appointments"
            className="w-full flex items-center justify-center space-x-2 bg-[color:var(--color-primary)]/10 hover:bg-[color:var(--color-primary)]/20 text-[color:var(--color-primary)] font-medium text-sm py-2 px-3 rounded-lg transition-colors duration-200 appointment-button-mobile"
          >
            <span>Ver detalles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-[color:var(--color-surface-elevated)] rounded-lg hover:bg-[color:var(--color-surface)] transition-colors duration-200">
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className="w-12 h-12 bg-[color:var(--color-primary)]/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-[color:var(--color-primary)] font-semibold text-base">
            {initials}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[color:var(--color-heading)] text-base truncate">
            {appointment.clientName}
          </p>
          <div className="text-sm text-[color:var(--color-body)] truncate">
            {formatServices(appointment).map((service, index) => (
              <span key={index} className="inline-flex items-center">
                {service.displayText}
                {service.quantity > 1 && (
                  <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]">
                    {service.quantity}
                  </span>
                )}
                {index < formatServices(appointment).length - 1 && (
                  <span className="mx-1 text-[color:var(--color-muted)]/60">•</span>
                )}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-4 text-xs text-[color:var(--color-muted)] mt-1">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(appointment.appointmentDate)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(appointment.appointmentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 flex-shrink-0">
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${statusColor}`}
        >
          {statusText}
        </span>
        <Link
          href="/admin/appointments"
          className="text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)] text-sm font-medium px-2 py-1 rounded focus-ring"
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

export default function RecentAppointments({
  appointments,
  isLoading,
}: RecentAppointmentsProps) {
  if (isLoading) {
    return (
      <div className="bg-[color:var(--color-surface)] rounded-xl shadow-sm border border-[color:var(--color-border)]/20">
        <div className="px-4 sm:px-6 py-4 border-b border-[color:var(--color-border)]/20">
          <h2 className="text-lg sm:text-xl font-semibold text-[color:var(--color-heading)]">
            Citas Recientes
          </h2>
        </div>
        <div className="p-6 sm:p-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 p-4 bg-[color:var(--color-surface-elevated)] rounded-lg">
                  <div className="w-12 h-12 bg-[color:var(--color-surface)] rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[color:var(--color-surface)] rounded w-1/3"></div>
                    <div className="h-3 bg-[color:var(--color-surface)] rounded w-1/2"></div>
                    <div className="h-3 bg-[color:var(--color-surface)] rounded w-1/4"></div>
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
    <div className="bg-[color:var(--color-surface)] rounded-xl shadow-sm border border-[color:var(--color-border)]/20">
      <div className="px-4 sm:px-6 py-4 border-b border-[color:var(--color-border)]/20 flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[color:var(--color-heading)]">
          Citas Recientes
        </h2>
        <Link
          href="/admin/appointments"
          className="flex items-center space-x-1 text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)] font-medium text-sm group"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="p-6 sm:p-8 text-center">
          <User className="w-12 h-12 text-[color:var(--color-muted)] mx-auto mb-4" />
          <p className="text-[color:var(--color-muted)] text-sm sm:text-base">
            No hay citas recientes
          </p>
          <Link
            href="/admin/appointments"
            className="inline-block mt-3 text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)] text-sm font-medium"
          >
            Ver todas las citas
          </Link>
        </div>
      ) : (
        <div className="p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4 recent-appointments-mobile">
            {appointments.map((appointment) => (
              <AppointmentItem key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
