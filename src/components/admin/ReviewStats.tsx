import React from 'react';
import { Star, MessageSquare, ThumbsUp, Clock } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ReviewStatsProps {
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
    aspectRatings: {
      professionalism: number;
      punctuality: number;
      quality: number;
      customerService: number;
      value: number;
    };
    recommendationRate: number;
    approvedReviews: number;
    pendingReviews: number;
  };
  isLoading?: boolean;
  error?: Error;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

function StatCard({ icon, title, value, subtitle, color = 'bg-blue-500' }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color} text-white mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

interface RatingBarProps {
  stars: number;
  count: number;
  total: number;
}

function RatingBar({ stars, count, total }: RatingBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1 w-16">
        <span className="text-sm text-gray-600">{stars}</span>
        <Star className="w-4 h-4 text-[#D4AF37] fill-current" />
      </div>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
    </div>
  );
}

interface AspectRatingProps {
  label: string;
  rating: number;
}

function AspectRating({ label, rating }: AspectRatingProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= rating
                  ? 'text-[#D4AF37] fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default function ReviewStats({ stats, isLoading, error }: ReviewStatsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar las estadísticas</p>
      </div>
    );
  }
  
  if (!stats) {
    return null;
  }
  
  const totalRatings = Object.values(stats.ratingDistribution).reduce((sum, count) => sum + count, 0);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Estadísticas de Reseñas</h2>
        <p className="text-gray-600">Análisis detallado del feedback de tus clientes</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<MessageSquare className="w-6 h-6" />}
          title="Total de Reseñas"
          value={stats.totalReviews}
          color="bg-blue-500"
        />
        
        <StatCard
          icon={<Star className="w-6 h-6" />}
          title="Calificación Promedio"
          value={stats.averageRating.toFixed(1)}
          subtitle="de 5.0 estrellas"
          color="bg-[#D4AF37]"
        />
        
        <StatCard
          icon={<ThumbsUp className="w-6 h-6" />}
          title="Tasa de Recomendación"
          value={`${stats.recommendationRate.toFixed(0)}%`}
          subtitle="clientes recomiendan"
          color="bg-green-500"
        />
        
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title="Pendientes de Aprobación"
          value={stats.pendingReviews}
          subtitle={`${stats.approvedReviews} aprobadas`}
          color="bg-orange-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución de Calificaciones
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <RatingBar
                key={stars}
                stars={stars}
                count={stats.ratingDistribution[stars as keyof typeof stats.ratingDistribution]}
                total={totalRatings}
              />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total de calificaciones</span>
              <span className="font-medium">{totalRatings}</span>
            </div>
          </div>
        </div>
        
        {/* Aspect Ratings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Calificaciones por Aspecto
          </h3>
          <div className="space-y-4">
            <AspectRating
              label="Profesionalismo"
              rating={stats.aspectRatings.professionalism}
            />
            <AspectRating
              label="Puntualidad"
              rating={stats.aspectRatings.punctuality}
            />
            <AspectRating
              label="Calidad del Trabajo"
              rating={stats.aspectRatings.quality}
            />
            <AspectRating
              label="Atención al Cliente"
              rating={stats.aspectRatings.customerService}
            />
            <AspectRating
              label="Relación Calidad-Precio"
              rating={stats.aspectRatings.value}
            />
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Aspectos destacados
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              {/* Encontrar el aspecto mejor calificado */}
              {(() => {
                const aspects = [
                  { name: 'Profesionalismo', rating: stats.aspectRatings.professionalism },
                  { name: 'Puntualidad', rating: stats.aspectRatings.punctuality },
                  { name: 'Calidad del Trabajo', rating: stats.aspectRatings.quality },
                  { name: 'Atención al Cliente', rating: stats.aspectRatings.customerService },
                  { name: 'Relación Calidad-Precio', rating: stats.aspectRatings.value },
                ];
                
                const bestAspect = aspects.reduce((best, current) => 
                  current.rating > best.rating ? current : best
                );
                
                const worstAspect = aspects.reduce((worst, current) => 
                  current.rating < worst.rating ? current : worst
                );
                
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span>🌟 Fortaleza:</span>
                      <span className="font-medium">{bestAspect.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>📈 Oportunidad:</span>
                      <span className="font-medium">{worstAspect.name}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] p-6 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-3">Insights y Recomendaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-90">
              📊 <strong>Rendimiento general:</strong> Con una calificación promedio de{' '}
              {stats.averageRating.toFixed(1)} estrellas, tu servicio está{' '}
              {stats.averageRating >= 4.5 ? 'excelente' : stats.averageRating >= 4 ? 'muy bien' : 'bien'}.
            </p>
          </div>
          <div>
            <p className="opacity-90">
              💡 <strong>Área de mejora:</strong> Enfócate en mejorar el aspecto con menor calificación
              para aumentar la satisfacción general del cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
