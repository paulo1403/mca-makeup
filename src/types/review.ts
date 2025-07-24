export interface Review {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  rating: number;
  comment: string;
  serviceType: string;
  serviceDate?: string;
  
  // Aspectos específicos
  ratingProfessionalism?: number;
  ratingPunctuality?: number;
  ratingQuality?: number;
  ratingCustomerService?: number;
  ratingValue?: number;
  
  // Aspectos cualitativos
  whatLikedMost?: string;
  suggestedImprovements?: string;
  wouldRecommend: boolean;
  
  // Control de moderación
  isApproved: boolean;
  isVisible: boolean;
  moderationNotes?: string;
  
  // Relación con cita
  appointmentId?: string;
  appointment?: {
    id: string;
    clientName: string;
    serviceType: string;
    appointmentDate: string;
  };
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
}

export interface CreateReviewData {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  rating: number;
  comment: string;
  serviceType: string;
  serviceDate?: string;
  
  // Aspectos específicos (opcionales)
  ratingProfessionalism?: number;
  ratingPunctuality?: number;
  ratingQuality?: number;
  ratingCustomerService?: number;
  ratingValue?: number;
  
  // Aspectos cualitativos
  whatLikedMost?: string;
  suggestedImprovements?: string;
  wouldRecommend?: boolean;
  
  // Relación con cita (opcional)
  appointmentId?: string;
}

export interface ReviewFilters {
  rating?: number;
  serviceType?: string;
  isApproved?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ReviewStats {
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
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
