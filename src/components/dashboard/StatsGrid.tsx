import { Calendar, CheckCircle, Clock, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/hooks/useDashboardStats";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-[color:var(--color-surface)] rounded-xl shadow-sm border border-[color:var(--color-border)]/30 p-4 sm:p-6 hover:shadow-md hover:border-[color:var(--color-primary)]/30 transition-all duration-200 hover-lift smooth-transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-[color:var(--color-muted)] mb-1 mobile-text">
            {title}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)]">{value}</p>
        </div>
        <div
          className={`p-2 sm:p-3 ${bgColor} rounded-lg flex-shrink-0 smooth-transition hover:scale-105`}
        >
          <div className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: DashboardStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  });

  const statCards = [
    {
      title: "Total de Citas",
      value: stats.totalAppointments.toLocaleString("es-PE"),
      icon: <Calendar className="w-full h-full" />,
      color: "text-blue-600",
      bgColor: "bg-[color:var(--color-surface-elevated)]",
    },
    {
      title: "Pendientes",
      value: stats.pendingAppointments.toLocaleString("es-PE"),
      icon: <Clock className="w-full h-full" />,
      color: "text-amber-600",
      bgColor: "bg-[color:var(--color-surface-elevated)]",
    },
    {
      title: "Confirmadas",
      value: stats.confirmedAppointments.toLocaleString("es-PE"),
      icon: <CheckCircle className="w-full h-full" />,
      color: "text-emerald-600",
      bgColor: "bg-[color:var(--color-surface-elevated)]",
    },
    {
      title: "Ingresos del Mes",
      value: currencyFormatter.format(stats.completedRevenueThisMonth || 0),
      icon: <TrendingUp className="w-full h-full" />,
      color: "text-[color:var(--color-primary)]",
      bgColor: "bg-[color:var(--color-surface-elevated)]",
    },
  ];

  const topRevenueMonths = stats.monthlyRevenueByIncome.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {topRevenueMonths.length > 0 && (
        <div className="rounded-xl border border-[color:var(--color-border)]/30 bg-[color:var(--color-surface-elevated)] p-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-sm font-semibold text-[color:var(--color-heading)]">
              Meses con mayor ingreso
            </p>
            <span className="text-xs text-[color:var(--color-muted)]">Ultimos 12 meses</span>
          </div>
          <div className="space-y-2">
            {topRevenueMonths.map((month) => (
              <div
                key={month.month}
                className="flex items-center justify-between rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/20 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[color:var(--color-heading)] capitalize">
                    {month.monthLabel}
                  </p>
                  <p className="text-xs text-[color:var(--color-muted)]">
                    {month.completedAppointments} completadas
                  </p>
                </div>
                <p className="text-sm font-semibold text-[color:var(--color-success)]">
                  {currencyFormatter.format(month.income || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
