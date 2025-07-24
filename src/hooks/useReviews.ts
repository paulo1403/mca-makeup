import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Review, CreateReviewData, ReviewFilters, ReviewStats } from '@/types/review';

interface UseReviewsParams {
  page: number;
  limit: number;
  filters: ReviewFilters;
}

interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Hook para obtener reviews (admin)
export const useAdminReviews = ({ page, limit, filters }: UseReviewsParams) => {
  return useQuery({
    queryKey: ['admin-reviews', page, limit, filters],
    queryFn: async (): Promise<ReviewsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters.rating && { rating: filters.rating.toString() }),
        ...(filters.serviceType && { serviceType: filters.serviceType }),
        ...(filters.isApproved !== undefined && { isApproved: filters.isApproved.toString() }),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      });

      const response = await fetch(`/api/admin/reviews?${params}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error fetching reviews');
      }

      return result.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

// Hook para obtener reviews públicos
export const usePublicReviews = ({ page, limit, minRating, serviceType }: {
  page: number;
  limit: number;
  minRating?: number;
  serviceType?: string;
}) => {
  return useQuery({
    queryKey: ['public-reviews', page, limit, minRating, serviceType],
    queryFn: async (): Promise<ReviewsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(minRating && { minRating: minRating.toString() }),
        ...(serviceType && { serviceType }),
      });

      const response = await fetch(`/api/reviews?${params}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error fetching reviews');
      }

      return result.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};

// Hook para crear review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: CreateReviewData) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error creating review');
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
  });
};

// Hook para actualizar review (admin)
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      isApproved, 
      isPublic, 
      moderationNotes 
    }: {
      id: string;
      isApproved?: boolean;
      isPublic?: boolean;
      moderationNotes?: string;
    }) => {
      const response = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isApproved, isPublic, moderationNotes }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Error updating review');
      }

      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['public-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
  });
};

// Hook para obtener estadísticas de reviews (admin)
export function useReviewStats() {
  return useQuery({
    queryKey: ['review-stats'],
    queryFn: async (): Promise<ReviewStats> => {
      const response = await fetch('/api/admin/reviews/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch review stats');
      }
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Error fetching review stats');
      }
      
      return result.data;
    },
  });
}

// Hook para eliminar review (admin)
export function useDeleteReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['public-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-stats'] });
    },
  });
}
