"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardSection from "@/components/dashboard/DashboardSection";
import ErrorState from "@/components/dashboard/ErrorState";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentAppointments from "@/components/dashboard/RecentAppointments";
import ReviewsStats from "@/components/dashboard/ReviewsStats";
import StatsGrid from "@/components/dashboard/StatsGrid";
import StatusSummary from "@/components/dashboard/StatusSummary";
import Button from "@/components/ui/Button";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRecentAppointments } from "@/hooks/useRecentAppointments";
import Link from "next/link";

export default function AdminDashboardModern() {
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

  // Initial loading state
  if (statsLoading && appointmentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
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
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <div className="container mx-auto dashboard-container safe-area-padding px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Top header (compact) */}
        <DashboardHeader />

        {/* Hero */}
        <div className="mb-6 sm:mb-8">
          <DashboardHero stats={stats} />
        </div>

        {/* Stats Grid */}
        {stats && (
          <DashboardSection title="Métricas" subtitle="Resumen de actividad">
            <div className="mobile-grid">
              <StatsGrid stats={stats} />
            </div>
          </DashboardSection>
        )}

        {/* Quick Actions */}
        <DashboardSection title="Acciones rápidas" subtitle="Atajos para gestión">
          <div className="mobile-grid">
            <QuickActions />
          </div>
        </DashboardSection>

        {/* Recent Appointments */}
        <DashboardSection
          title="Citas recientes"
          subtitle="Últimas actividades"
          action={
            <Link href="/admin/appointments">
              <Button variant="secondary" size="sm" className="rounded-full">
                Ver todas
              </Button>
            </Link>
          }
        >
          <RecentAppointments appointments={recentAppointments} isLoading={appointmentsLoading} />
        </DashboardSection>

        {/* Reviews Statistics */}
        {stats && (
          <DashboardSection title="Reseñas" subtitle="Feedback de clientes">
            <ReviewsStats stats={stats} />
          </DashboardSection>
        )}

        {/* Status Summary */}
        {stats && (
          <DashboardSection title="Resumen de estados">
            <StatusSummary stats={stats} />
          </DashboardSection>
        )}
      </div>
    </div>
  );
}
