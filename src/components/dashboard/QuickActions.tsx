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
      className="group bg-[color:var(--color-surface)] rounded-xl shadow-sm border border-[color:var(--color-border)]/20 p-3 hover:shadow-md hover:border-[color:var(--color-border)]/40 transition-transform duration-200 active:scale-95 focus-ring h-full flex flex-col"
    >
      <div className="flex items-start space-x-3">
        <div className={`flex items-center justify-center ${iconBgColor} rounded-full w-10 h-10 flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-[color:var(--color-heading)] group-hover:text-[color:var(--color-primary)] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-xs text-[color:var(--color-muted)] mt-1 leading-snug">{description}</p>
        </div>
      </div>

      <div className="mt-auto pt-3">
        {/* optional secondary action or spacing to ensure equal heights */}
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
      iconColor: 'text-[color:var(--color-accent)]',
      iconBgColor: 'bg-[color:var(--color-accent)]/12',
    },
    {
      href: '/admin/appointments',
      title: 'Gestionar Citas',
      description: 'Ver y administrar todas las citas',
      icon: Calendar,
      iconColor: 'text-[color:var(--color-primary)]',
      iconBgColor: 'bg-[color:var(--color-primary)]/12',
    },
    {
      href: '/admin/availability',
      title: 'Disponibilidad',
      description: 'Configurar horarios disponibles',
      icon: Clock,
      iconColor: 'text-[color:var(--color-accent)]',
      iconBgColor: 'bg-[color:var(--color-accent)]/12',
    },
    {
      href: '/admin/change-password',
      title: 'Configuración',
      description: 'Cambiar contraseña y ajustes',
      icon: Settings,
      iconColor: 'text-[color:var(--color-accent)]',
      iconBgColor: 'bg-[color:var(--color-accent)]/12',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 items-stretch">
      {actions.map((action) => (
        <QuickActionCard key={action.href} {...action} />
      ))}
    </div>
  );
}
