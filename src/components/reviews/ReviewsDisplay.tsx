import React from 'react';
import { usePublicReviews } from '@/hooks/useReviews';
import { Star, Heart, Calendar, Quote } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

interface ReviewCardProps {
  review: {
    id: string;
    clientName: string;
    rating: number;
    comment: string;
    serviceType: string;
    serviceDate?: string;
    whatLikedMost?: string;
    wouldRecommend?: boolean;
    createdAt: string;
  };
}

function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{review.clientName}</h3>
          <p className="text-sm text-gray-600">{review.serviceType}</p>
          {review.serviceDate && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(review.serviceDate)}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= review.rating
                  ? 'text-[#D4AF37] fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div className="relative mb-4">
        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-[#D4AF37] opacity-30" />
        <p className="text-gray-700 leading-relaxed pl-6 italic">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>
      
      {review.whatLikedMost && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-[#D4AF37]">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Lo que más me gustó:</span> {review.whatLikedMost}
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {formatDate(review.createdAt)}
        </span>
        {review.wouldRecommend && (
          <div className="flex items-center text-green-600">
            <Heart className="w-4 h-4 mr-1 fill-current" />
            <span className="text-xs font-medium">Recomendado</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface ReviewsDisplayProps {
  maxReviews?: number;
  showTitle?: boolean;
  showViewMore?: boolean;
  onWriteReview?: () => void;
}

export default function ReviewsDisplay({ 
  maxReviews, 
  showTitle = true, 
  showViewMore = true,
  onWriteReview
}: ReviewsDisplayProps) {
  const { data: reviewsData, isLoading, error } = usePublicReviews({ page: 1, limit: 100 });
  
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
        <p className="text-gray-600">
          No se pudieron cargar las reseñas en este momento.
        </p>
      </div>
    );
  }
  
  const reviews = reviewsData?.reviews || [];
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aún no hay reseñas
          </h3>
          <p className="text-gray-600 mb-6">
            Sé la primera persona en compartir tu experiencia con nuestros servicios.
          </p>
          {onWriteReview ? (
            <button 
              onClick={onWriteReview}
              className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              Escribir primera reseña
            </button>
          ) : (
            <Link 
              href="/reviews"
              className="inline-block bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              Escribir primera reseña
            </Link>
          )}
        </div>
      </div>
    );
  }
  
  const displayedReviews = maxReviews ? reviews.slice(0, maxReviews) : reviews;
  
  // Calcular estadísticas
  const averageRating = reviews.reduce((sum: number, review) => sum + review.rating, 0) / reviews.length;
  const recommendationRate = reviews.filter((review) => review.wouldRecommend).length / reviews.length * 100;
  
  return (
    <div className="space-y-8">
      {showTitle && (
        <div className="text-center">
          <h2 className="text-3xl font-playfair text-gray-900 mb-4">
            Experiencias de Nuestras Clientas
          </h2>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-[#D4AF37] fill-current mr-1" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
              <span className="ml-1">de 5 estrellas</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-5 h-5 text-red-500 fill-current mr-1" />
              <span className="font-semibold">{recommendationRate.toFixed(0)}%</span>
              <span className="ml-1">recomiendan</span>
            </div>
            <div>
              <span className="font-semibold">{reviews.length}</span>
              <span className="ml-1">reseñas totales</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      
      {showViewMore && maxReviews && reviews.length > maxReviews && (
        <div className="text-center">
          <button className="bg-[#D4AF37] text-white px-8 py-3 rounded-lg hover:bg-[#B8941F] transition-colors font-medium">
            Ver todas las reseñas ({reviews.length - maxReviews} más)
          </button>
        </div>
      )}
    </div>
  );
}
