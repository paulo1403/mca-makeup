import Link from 'next/link';
import { Calendar, Clock, Settings, CalendarDays, LucideIcon } from 'lucide-react';

interface QuickActionProps {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

function QuickActionCard({ href, title, description, icon: Icon, iconColor, iconBgColor }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md hover:border-[#D4AF37]/20 transition-all duration-200 active:scale-95 smooth-transition hover-lift touch-target focus-ring"
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className={`p-2 sm:p-3 ${iconBgColor} rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#D4AF37] transition-colors duration-200 mobile-text">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 mobile-text">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export default function QuickActions() {
  const actions = [
    {
      href: '/admin/calendar',
      title: 'Calendario',
      description: 'Vista de calendario con todas las citas',
      icon: CalendarDays,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-50',
    },
    {
      href: '/admin/appointments',
      title: 'Gestionar Citas',
      description: 'Ver y administrar todas las citas',
      icon: Calendar,
      iconColor: 'text-[#D4AF37]',
      iconBgColor: 'bg-[#D4AF37]/10',
    },
    {
      href: '/admin/availability',
      title: 'Disponibilidad',
      description: 'Configurar horarios disponibles',
      icon: Clock,
      iconColor: 'text-emerald-600',
      iconBgColor: 'bg-emerald-50',
    },
    {
      href: '/admin/change-password',
      title: 'Configuración',
      description: 'Cambiar contraseña y ajustes',
      icon: Settings,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      {actions.map((action) => (
        <QuickActionCard key={action.href} {...action} />
      ))}
    </div>
  );
}
