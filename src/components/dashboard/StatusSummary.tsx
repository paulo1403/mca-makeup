import { type DashboardStats } from '@/hooks/useDashboardStats';

interface StatusSummaryProps {
  stats: DashboardStats;
}

export default function StatusSummary({ stats }: StatusSummaryProps) {
  const summaryItems = [
    {
      label: 'Pendientes de revisar',
      value: stats.pendingAppointments,
      color: 'text-amber-600',
      bgColor: 'bg-[color:var(--color-surface-elevated)]',
      borderColor: 'border-[color:var(--color-border)]/30',
    },
    {
      label: 'Confirmadas',
      value: stats.confirmedAppointments,
      color: 'text-emerald-600',
      bgColor: 'bg-[color:var(--color-surface-elevated)]',
      borderColor: 'border-[color:var(--color-border)]/30',
    },
    {
      label: 'Completadas',
      value: stats.completedAppointments,
      color: 'text-blue-600',
      bgColor: 'bg-[color:var(--color-surface-elevated)]',
      borderColor: 'border-[color:var(--color-border)]/30',
    },
    {
      label: 'Canceladas',
      value: stats.cancelledAppointments,
      color: 'text-red-600',
      bgColor: 'bg-[color:var(--color-surface-elevated)]',
      borderColor: 'border-[color:var(--color-border)]/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {summaryItems.map((item) => (
        <div
          key={item.label}
          className={`${item.bgColor} ${item.borderColor} rounded-lg border p-3 sm:p-4 text-center hover:shadow-sm transition-shadow duration-200`}
        >
          <div className={`text-xl sm:text-2xl font-bold ${item.color} mb-1`}>
            {item.value.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-[color:var(--color-muted)] leading-tight">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
