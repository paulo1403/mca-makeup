import React, { useState } from 'react';
import { useAdminReviews, useUpdateReview, useDeleteReview } from '@/hooks/useReviews';
import { Star, Calendar, Eye, EyeOff, Trash2, Check, Search } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ReviewCardProps {
  review: {
    id: string;
    clientName: string;
    clientEmail?: string;
    rating: number;
    comment: string;
    serviceType: string;
    serviceDate?: string;
    whatLikedMost?: string;
    suggestedImprovements?: string;
    wouldRecommend?: boolean;
    isApproved: boolean;
    isVisible: boolean;
    createdAt: string;
    ratingProfessionalism?: number;
    ratingPunctuality?: number;
    ratingQuality?: number;
    ratingCustomerService?: number;
    ratingValue?: number;
  };
  onUpdate: (id: string, updates: { isApproved?: boolean; isVisible?: boolean }) => void;
  onDelete: (id: string) => void;
}

function AdminReviewCard({ review, onUpdate, onDelete }: ReviewCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (!review.isApproved) return 'bg-yellow-100 text-yellow-800';
    if (review.isVisible) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusText = () => {
    if (!review.isApproved) return 'Pendiente';
    if (review.isVisible) return 'Publicado';
    return 'Aprobado (Oculto)';
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{review.clientName}</h3>
            {review.clientEmail && (
              <p className="text-sm text-gray-600">{review.clientEmail}</p>
            )}
            <p className="text-sm text-gray-600">{review.serviceType}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'text-[#D4AF37] fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </div>

        {/* Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-[#D4AF37] hover:text-[#B8941F] mb-4"
        >
          {showDetails ? 'Ocultar detalles' : 'Ver más detalles'}
        </button>

        {/* Detailed Information */}
        {showDetails && (
          <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            {/* Service Date */}
            {review.serviceDate && (
              <div>
                <span className="text-sm font-medium text-gray-700">Fecha del servicio: </span>
                <span className="text-sm text-gray-600">
                  {new Date(review.serviceDate).toLocaleDateString('es-ES')}
                </span>
              </div>
            )}

            {/* What Liked Most */}
            {review.whatLikedMost && (
              <div>
                <span className="text-sm font-medium text-gray-700">Lo que más le gustó: </span>
                <p className="text-sm text-gray-600 mt-1">{review.whatLikedMost}</p>
              </div>
            )}

            {/* Suggested Improvements */}
            {review.suggestedImprovements && (
              <div>
                <span className="text-sm font-medium text-gray-700">Sugerencias de mejora: </span>
                <p className="text-sm text-gray-600 mt-1">{review.suggestedImprovements}</p>
              </div>
            )}

            {/* Detailed Ratings */}
            <div>
              <span className="text-sm font-medium text-gray-700 block mb-2">Calificaciones detalladas:</span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {review.ratingProfessionalism && (
                  <div className="flex justify-between">
                    <span>Profesionalismo:</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.ratingProfessionalism!
                              ? 'text-[#D4AF37] fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {review.ratingPunctuality && (
                  <div className="flex justify-between">
                    <span>Puntualidad:</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.ratingPunctuality!
                              ? 'text-[#D4AF37] fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {review.ratingQuality && (
                  <div className="flex justify-between">
                    <span>Calidad:</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.ratingQuality!
                              ? 'text-[#D4AF37] fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {review.ratingCustomerService && (
                  <div className="flex justify-between">
                    <span>Atención:</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.ratingCustomerService!
                              ? 'text-[#D4AF37] fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {review.ratingValue && (
                  <div className="flex justify-between">
                    <span>Relación calidad-precio:</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.ratingValue!
                              ? 'text-[#D4AF37] fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendation */}
            {review.wouldRecommend !== undefined && (
              <div>
                <span className="text-sm font-medium text-gray-700">Recomendaría el servicio: </span>
                <span className={`text-sm ${review.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
                  {review.wouldRecommend ? 'Sí' : 'No'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(review.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex space-x-2">
            {!review.isApproved && (
              <button
                onClick={() => onUpdate(review.id, { isApproved: true, isVisible: true })}
                className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                <Check className="w-4 h-4 mr-1" />
                Aprobar y Publicar
              </button>
            )}
            
            {review.isApproved && (
              <button
                onClick={() => onUpdate(review.id, { isVisible: !review.isVisible })}
                className={`flex items-center px-3 py-1 rounded-lg transition-colors text-sm ${
                  review.isVisible
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {review.isVisible ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Ocultar
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Mostrar
                  </>
                )}
              </button>
            )}
          </div>

          <button
            onClick={() => onDelete(review.id)}
            className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminReviews() {
  const [filters, setFilters] = useState({
    status: 'all', // all, pending, approved, visible
    rating: '',
    serviceType: '',
    search: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();
  
  // Build query parameters based on filters
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    filters: {
      ...(filters.rating && { minRating: parseInt(filters.rating) }),
      ...(filters.serviceType && { serviceType: filters.serviceType }),
      ...(filters.search && { search: filters.search }),
      ...(filters.status === 'pending' && { isApproved: false }),
      ...(filters.status === 'approved' && { isApproved: true }),
      ...(filters.status === 'visible' && { isVisible: true }),
    }
  };
  
  const { data, isLoading, error } = useAdminReviews(queryParams);
  
  const handleUpdateReview = async (id: string, updates: { isApproved?: boolean; isVisible?: boolean }) => {
    try {
      await updateReviewMutation.mutateAsync({ id, ...updates });
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };
  
  const handleDeleteReview = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await deleteReviewMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };
  
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
        <p className="text-red-600">Error al cargar las reseñas</p>
      </div>
    );
  }
  
  const reviews = data?.reviews || [];
  const totalPages = Math.ceil((data?.pagination?.total || 0) / pageSize);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Reseñas</h1>
        <div className="text-sm text-gray-600">
          Total: {data?.pagination?.total || 0} reseñas
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Nombre o comentario..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="visible">Publicados</option>
            </select>
          </div>
          
          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calificación mínima
            </label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm"
            >
              <option value="">Todas</option>
              <option value="5">5 estrellas</option>
              <option value="4">4+ estrellas</option>
              <option value="3">3+ estrellas</option>
              <option value="2">2+ estrellas</option>
              <option value="1">1+ estrellas</option>
            </select>
          </div>
          
          {/* Service Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de servicio
            </label>
            <select
              value={filters.serviceType}
              onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm"
            >
              <option value="">Todos</option>
              <option value="Maquillaje de Novia">Maquillaje de Novia</option>
              <option value="Maquillaje Social">Maquillaje Social</option>
              <option value="Maquillaje Editorial">Maquillaje Editorial</option>
              <option value="Maquillaje para Eventos">Maquillaje para Eventos</option>
              <option value="Asesoría de Imagen">Asesoría de Imagen</option>
              <option value="Peinados">Peinados</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No se encontraron reseñas con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <AdminReviewCard
              key={review.id}
              review={review}
              onUpdate={handleUpdateReview}
              onDelete={handleDeleteReview}
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
