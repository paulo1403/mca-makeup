'use client';

import { useState } from 'react';
import AdminReviews from '@/components/admin/AdminReviews';
import ReviewStats from '@/components/admin/ReviewStats';
import { useReviewStats } from '@/hooks/useReviews';
import { BarChart3, MessageSquare } from 'lucide-react';

type TabType = 'reviews' | 'stats';

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('reviews');
  const { data: stats, isLoading: statsLoading, error: statsError } = useReviewStats();
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reseñas y Feedback</h1>
        <p className="text-gray-600">
          Gestiona las reseñas de tus clientes y analiza el feedback para mejorar tu servicio
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Gestión de Reseñas</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Estadísticas y Análisis</span>
            </div>
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'reviews' && <AdminReviews />}
        {activeTab === 'stats' && (
          <ReviewStats
            stats={stats || {
              totalReviews: 0,
              averageRating: 0,
              ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              aspectRatings: {
                professionalism: 0,
                punctuality: 0,
                quality: 0,
                customerService: 0,
                value: 0
              },
              recommendationRate: 0,
              approvedReviews: 0,
              pendingReviews: 0
            }}
            isLoading={statsLoading}
            error={statsError || undefined}
          />
        )}
      </div>
    </div>
  );
}
