import { Star, MessageSquare, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { type DashboardStats } from '@/hooks/useDashboardStats';

interface ReviewStatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  subtitle?: string;
}

function ReviewStatCard({ title, value, icon, color, bgColor, subtitle }: ReviewStatCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 sm:p-6 transition-all duration-200 hover-lift smooth-transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted mb-1 mobile-text">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-heading">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted mt-1">{subtitle}</p>
          )}
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

interface ReviewsStatsProps {
  stats: DashboardStats;
}

export default function ReviewsStats({ stats }: ReviewsStatsProps) {
  const reviewCards = [
    {
      title: 'Total de Reseñas',
      value: stats.totalReviews,
      icon: <MessageSquare className="w-full h-full" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Calificación Promedio',
      value: stats.averageRating > 0 ? `${stats.averageRating} ⭐` : 'Sin calificar',
      icon: <Star className="w-full h-full" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      subtitle: stats.averageRating > 0 ? `Basado en ${stats.approvedReviews} reseñas` : undefined,
    },
    {
      title: 'Pendientes',
      value: stats.pendingReviews,
      icon: <Clock className="w-full h-full" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Aprobadas',
      value: stats.approvedReviews,
      icon: <CheckCircle className="w-full h-full" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Públicas',
      value: stats.publicReviews,
      icon: <Eye className="w-full h-full" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subtitle: 'Visibles en el sitio web',
    },
    {
      title: 'Rechazadas',
      value: stats.rejectedReviews,
      icon: <XCircle className="w-full h-full" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  if (stats.totalReviews === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin reseñas aún</h3>
        <p className="text-gray-600">
          Las reseñas aparecerán aquí cuando las clientas completen sus citas y dejen comentarios.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold text-[#1C1C1C] mb-4 mobile-text">
        Estadísticas de Reseñas
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {reviewCards.map((card) => (
          <ReviewStatCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
