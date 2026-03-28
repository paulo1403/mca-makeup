"use client";

import { ChevronDown } from "lucide-react";
import { Suspense, useState } from "react";
import AppointmentModal from "@/components/appointments/AppointmentModal";
import AppointmentTable from "@/components/appointments/AppointmentTable";
import LoadingSpinner from "@/components/appointments/LoadingSpinner";
import ManualAppointmentModal from "@/components/appointments/ManualAppointmentModal";
import Pagination from "@/components/appointments/Pagination";
import { useAppointmentsPage } from "@/hooks/useAppointmentsPage";
import { useDashboardStats } from "@/hooks/useDashboardStats";

function AppointmentsContent() {
  const [showManualModal, setShowManualModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { data: dashboardStats } = useDashboardStats();

  const {
    appointments,
    pagination,
    filter,
    searchTerm,
    currentPage,
    selectedAppointment,
    showModal,
    highlightedId,
    isLoading,
    error,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handleViewDetails,
    handleCloseModal,
  } = useAppointmentsPage();

  if (error) {
    return (
      <div className="min-h-screen bg-[color:var(--color-app-bg)] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-[color:var(--color-surface)] rounded-xl shadow-lg p-6 text-center border border-[color:var(--color-border)]">
            <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-danger"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-heading mb-2">Error al cargar las citas</h2>
            <p className="text-muted mb-6">
              {error instanceof Error ? error.message : "Ha ocurrido un error inesperado"}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full bg-[color:var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[color:var(--color-primary-hover)] transition-colors font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner message="Cargando citas..." />;
  }

  const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  });

  const monthlyRevenue = dashboardStats?.completedRevenueThisMonth || 0;
  const topRevenueMonth = dashboardStats?.monthlyRevenueByIncome?.[0];
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-[color:var(--color-app-bg)]">
      {/* Minimalist Header */}
      <div className="bg-[color:var(--color-surface)] shadow-sm border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-heading font-playfair">Citas</h1>
            <button
              type="button"
              onClick={() => setShowManualModal(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)] transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              Ingreso manual
            </button>
          </div>

          {/* KPIs - Compact */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div
              className="rounded-lg px-2.5 py-2 border"
              style={{
                backgroundColor: "var(--status-confirmed-bg)",
                borderColor: "var(--status-confirmed-border)",
              }}
            >
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--status-confirmed-text)" }}
              >
                {confirmedCount}
              </div>
              <div className="text-xs" style={{ color: "var(--status-confirmed-text)" }}>
                Confirmadas
              </div>
            </div>
            <div
              className="rounded-lg px-2.5 py-2 border"
              style={{
                backgroundColor: "var(--status-pending-bg)",
                borderColor: "var(--status-pending-border)",
              }}
            >
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--status-pending-text)" }}
              >
                {pendingCount}
              </div>
              <div className="text-xs" style={{ color: "var(--status-pending-text)" }}>
                Pendientes
              </div>
            </div>
            <div
              className="rounded-lg px-2.5 py-2 border"
              style={{
                backgroundColor: "var(--status-completed-bg)",
                borderColor: "var(--status-completed-border)",
              }}
            >
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--status-completed-text)" }}
              >
                {completedCount}
              </div>
              <div className="text-xs" style={{ color: "var(--status-completed-text)" }}>
                Completadas
              </div>
            </div>
          </div>

          {/* Collapsible Stats */}
          <button
            type="button"
            onClick={() => setShowStats(!showStats)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-[color:var(--color-muted)] hover:text-heading transition-colors"
          >
            <span className="font-medium">Ver estadísticas</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showStats ? "rotate-180" : ""}`}
            />
          </button>

          {showStats && (
            <div className="mt-3 pt-3 border-t border-[color:var(--color-border)] space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[color:var(--color-muted)]">Total citas:</span>
                <span className="font-semibold text-heading">{pagination?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:var(--color-muted)]">Ingresos este mes:</span>
                <span className="font-semibold text-[color:var(--color-success)]">
                  {currencyFormatter.format(monthlyRevenue)}
                </span>
              </div>
              {topRevenueMonth && (
                <div className="flex justify-between">
                  <span className="text-[color:var(--color-muted)]">Mes con más ingresos:</span>
                  <span className="font-semibold text-heading capitalize">
                    {topRevenueMonth.monthLabel} (
                    {currencyFormatter.format(topRevenueMonth.income || 0)})
                  </span>
                </div>
              )}
              {appointments.length > 0 && (
                <div className="flex items-center space-x-2 pt-2 border-t border-[color:var(--color-border)]">
                  <div className="w-2 h-2 bg-[color:var(--color-success)] rounded-full" />
                  <span className="text-[color:var(--color-muted)]">Datos en tiempo real</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-3 space-y-3">
        {/* Search - Minimal */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-[color:var(--color-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar cliente, servicio..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[color:var(--color-surface)] text-heading placeholder-[color:var(--color-muted)] border border-[color:var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/50 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Todas" },
            { value: "PENDING", label: "Pendientes" },
            { value: "CONFIRMED", label: "Confirmadas" },
            { value: "COMPLETED", label: "Completadas" },
            { value: "CANCELLED", label: "Canceladas" },
          ].map((item) => {
            const isActive = filter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleFilterChange(item.value)}
                className={[
                  "px-3 py-1.5 text-xs rounded-full border transition-colors",
                  isActive
                    ? "bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]"
                    : "bg-[color:var(--color-surface)] text-[color:var(--color-muted)] border-[color:var(--color-border)] hover:text-heading",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Appointments Content */}
        <div className="overflow-hidden">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[color:var(--color-surface-elevated)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[color:var(--color-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">No hay citas</h3>
              <p className="text-muted mb-6">
                {filter !== "all"
                  ? "No se encontraron citas con el filtro seleccionado"
                  : "Aún no tienes citas programadas"}
              </p>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="bg-[color:var(--color-primary)] text-white px-6 py-2 rounded-lg hover:bg-[color:var(--color-primary-hover)] transition-colors font-medium"
              >
                Ver sitio web
              </button>
            </div>
          ) : (
            <AppointmentTable
              appointments={appointments}
              highlightedId={highlightedId || undefined}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="bg-[color:var(--color-surface)] rounded-xl shadow-sm border border-[color:var(--color-border)] p-4">
            <Pagination
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={showModal}
        onClose={handleCloseModal}
      />

      <ManualAppointmentModal isOpen={showManualModal} onClose={() => setShowManualModal(false)} />
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Inicializando..." />}>
      <AppointmentsContent />
    </Suspense>
  );
}
