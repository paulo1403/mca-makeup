"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRecentAppointments } from "@/hooks/useRecentAppointments";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentAppointments from "@/components/dashboard/RecentAppointments";
import StatusSummary from "@/components/dashboard/StatusSummary";
import ReviewsStats from "@/components/dashboard/ReviewsStats";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import ErrorState from "@/components/dashboard/ErrorState";

export default function AdminDashboard() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats();
  const {
    data: recentAppointments = [],
    isLoading: appointmentsLoading,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useRecentAppointments(5);

  // Show loading spinner only if both queries are loading initially
  if (statsLoading && appointmentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error state if critical data fails to load
  if (statsError || appointmentsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          onRetry={() => {
            refetchStats();
            refetchAppointments();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto dashboard-container safe-area-padding px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <DashboardHeader />

        {/* Stats Grid */}
        {stats && (
          <div className="mobile-grid">
            <StatsGrid stats={stats} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mobile-grid">
          <QuickActions />
        </div>

        {/* Recent Appointments */}
        <div className="mb-6 sm:mb-8">
          <RecentAppointments
            appointments={recentAppointments}
            isLoading={appointmentsLoading}
          />
        </div>

        {/* Reviews Statistics */}
        {stats && (
          <div className="mb-6 sm:mb-8">
            <ReviewsStats stats={stats} />
          </div>
        )}

        {/* Status Summary */}
        {stats && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-[#1C1C1C] mb-4 mobile-text">
              Resumen de Estados
            </h3>
            <div className="mobile-grid">
              <StatusSummary stats={stats} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
