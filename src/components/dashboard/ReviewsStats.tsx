import { Star, MessageSquare, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { type DashboardStats } from '@/hooks/useDashboardStats';
import Typography from "@/components/ui/Typography";

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
    <div className="bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]/30 p-4 sm:p-6 transition-all duration-200 hover:border-[color:var(--color-primary)]/30 hover-lift smooth-transition">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Typography as="p" variant="small" className="font-medium text-[color:var(--color-muted)] mb-1 mobile-text">{title}</Typography>
          <Typography as="p" variant="h3" className="font-bold text-[color:var(--color-heading)]">{value}</Typography>
          {subtitle && (
            <Typography as="p" variant="caption" className="text-[color:var(--color-muted)] mt-1">{subtitle}</Typography>
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
      color: 'text-[color:var(--color-accent)]',
      bgColor: 'bg-[color:var(--color-accent)]/12',
    },
    {
      title: 'Calificación Promedio',
      value: stats.averageRating > 0 ? `${stats.averageRating} ⭐` : 'Sin calificar',
      icon: <Star className="w-full h-full" />,
      color: 'text-[color:var(--color-primary)]',
      bgColor: 'bg-[color:var(--color-primary)]/12',
      subtitle: stats.averageRating > 0 ? `Basado en ${stats.approvedReviews} reseñas` : undefined,
    },
    {
      title: 'Pendientes',
      value: stats.pendingReviews,
      icon: <Clock className="w-full h-full" />,
      color: 'text-[color:var(--color-accent)]',
      bgColor: 'bg-[color:var(--color-accent)]/12',
    },
    {
      title: 'Aprobadas',
      value: stats.approvedReviews,
      icon: <CheckCircle className="w-full h-full" />,
      color: 'text-[color:var(--color-accent)]',
      bgColor: 'bg-[color:var(--color-accent)]/12',
    },
    {
      title: 'Públicas',
      value: stats.publicReviews,
      icon: <Eye className="w-full h-full" />,
      color: 'text-[color:var(--color-primary)]',
      bgColor: 'bg-[color:var(--color-primary)]/12',
      subtitle: 'Visibles en el sitio web',
    },
    {
      title: 'Rechazadas',
      value: stats.rejectedReviews,
      icon: <XCircle className="w-full h-full" />,
      color: 'text-[color:var(--color-accent)]',
      bgColor: 'bg-[color:var(--color-accent)]/12',
    },
  ];

  if (stats.totalReviews === 0) {
    return (
      <div className="bg-[color:var(--color-surface)] rounded-xl shadow-sm border border-[color:var(--color-border)]/30 p-6 text-center">
        <MessageSquare className="h-12 w-12 text-[color:var(--color-muted)] mx-auto mb-4" />
        <Typography as="h3" variant="h3" className="text-[color:var(--color-heading)] mb-2">Sin reseñas aún</Typography>
        <Typography className="text-[color:var(--color-muted)]">
          Las reseñas aparecerán aquí cuando las clientas completen sus citas y dejen comentarios.
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography as="h3" variant="h3" className="text-[color:var(--color-heading)] mb-4 mobile-text">
        Estadísticas de Reseñas
      </Typography>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {reviewCards.map((card) => (
          <ReviewStatCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}
