import { Calendar, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { type DashboardStats } from '@/hooks/useDashboardStats';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md hover:border-[#D4AF37]/20 transition-all duration-200 hover-lift smooth-transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 mobile-text">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`p-2 sm:p-3 ${bgColor} rounded-lg flex-shrink-0 smooth-transition hover:scale-105`}>
          <div className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: DashboardStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    {
      title: 'Total de Citas',
      value: stats.totalAppointments,
      icon: <Calendar className="w-full h-full" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pendientes',
      value: stats.pendingAppointments,
      icon: <Clock className="w-full h-full" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Confirmadas',
      value: stats.confirmedAppointments,
      icon: <CheckCircle className="w-full h-full" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Este Mes',
      value: stats.thisMonthAppointments,
      icon: <TrendingUp className="w-full h-full" />,
      color: 'text-[#D4AF37]',
      bgColor: 'bg-[#D4AF37]/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
      {statCards.map((card) => (
        <StatCard key={card.title} {...card} />
      ))}
    </div>
  );
}
