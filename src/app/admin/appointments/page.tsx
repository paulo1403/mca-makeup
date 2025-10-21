"use client";

import { Suspense } from "react";
import { useAppointmentsPage } from "@/hooks/useAppointmentsPage";
import AppointmentFilters from "@/components/appointments/AppointmentFilters";
import AppointmentTable from "@/components/appointments/AppointmentTable";
import Pagination from "@/components/appointments/Pagination";
import AppointmentModal from "@/components/appointments/AppointmentModal";
import LoadingSpinner from "@/components/appointments/LoadingSpinner";

function AppointmentsContent() {
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
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-heading mb-2">
              Error al cargar las citas
            </h2>
            <p className="text-muted mb-6">
              {error instanceof Error
                ? error.message
                : "Ha ocurrido un error inesperado"}
            </p>
            <button
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

  return (
    <div className="min-h-screen bg-[color:var(--color-app-bg)]">
      {/* Mobile Header */}
      <div className="bg-[color:var(--color-surface)] shadow-sm border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-heading font-playfair">
                Gestión de Citas
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="text-sm text-muted">
                  Total:{" "}
                  <span className="font-semibold text-[color:var(--color-primary)]">
                    {pagination?.total || 0}
                  </span>{" "}
                  citas
                </div>
                <div className="text-sm text-muted">
                  Ingresos:{" "}
                  <span className="font-semibold text-[color:var(--color-success)]">
                    {new Intl.NumberFormat("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    }).format(
                      appointments.reduce(
                        (total, apt) => total + (apt.totalPrice || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>
                {appointments.length > 0 && (
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[color:var(--color-success)] rounded-full"></div>
                    <span className="text-xs text-muted">
                      En tiempo real
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:space-x-3">
              <div
                className="rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-center border"
                style={{
                  backgroundColor: "var(--status-confirmed-bg)",
                  borderColor: "var(--status-confirmed-border)",
                }}
              >
                <div
                  className="text-xs sm:text-sm font-semibold"
                  style={{ color: "var(--status-confirmed-text)" }}
                >
                  {appointments.filter((a) => a.status === "CONFIRMED").length}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--status-confirmed-text)" }}
                >
                  Confirmadas
                </div>
              </div>
              <div
                className="rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-center border"
                style={{
                  backgroundColor: "var(--status-pending-bg)",
                  borderColor: "var(--status-pending-border)",
                }}
              >
                <div
                  className="text-xs sm:text-sm font-semibold"
                  style={{ color: "var(--status-pending-text)" }}
                >
                  {appointments.filter((a) => a.status === "PENDING").length}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--status-pending-text)" }}
                >
                  Pendientes
                </div>
              </div>
              <div
                className="rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-center border"
                style={{
                  backgroundColor: "var(--status-completed-bg)",
                  borderColor: "var(--status-completed-border)",
                }}
              >
                <div
                  className="text-xs sm:text-sm font-semibold"
                  style={{ color: "var(--status-completed-text)" }}
                >
                  {appointments.filter((a) => a.status === "COMPLETED").length}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--status-completed-text)" }}
                >
                  Completadas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Filters Section - Mobile First */}
        <div className="bg-[color:var(--color-surface)] rounded-xl shadow-sm border border-[color:var(--color-border)] p-4" data-filters>
          <AppointmentFilters
            searchTerm={searchTerm}
            filter={filter}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Appointments Content */}
        <div className="bg-[color:var(--color-surface)] rounded-xl shadow-sm border border-[color:var(--color-border)] overflow-hidden">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[color:var(--color-surface-elevated)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[color:var(--color-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-heading mb-2">
                No hay citas
              </h3>
              <p className="text-muted mb-6">
                {filter !== "all"
                  ? "No se encontraron citas con el filtro seleccionado"
                  : "Aún no tienes citas programadas"}
              </p>
              <button
                onClick={() => (window.location.href = "/")}
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

        {/* Pagination - Mobile Optimized */}
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

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <button
          onClick={() => {
            const filters = document.querySelector("[data-filters]");
            filters?.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-14 h-14 bg-[color:var(--color-primary)] text-white rounded-full shadow-lg hover:bg-[color:var(--color-primary-hover)] transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
            />
          </svg>
        </button>
      </div>

      {/* Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
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
