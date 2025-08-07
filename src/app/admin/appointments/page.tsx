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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error al cargar las citas
            </h2>
            <p className="text-gray-600 mb-6">
              {error instanceof Error
                ? error.message
                : "Ha ocurrido un error inesperado"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#B8941F] transition-colors font-medium"
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-[#1C1C1C] font-playfair">
                Gestión de Citas
              </h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="text-sm text-gray-600">
                  Total:{" "}
                  <span className="font-semibold text-[#D4AF37]">
                    {pagination?.total || 0}
                  </span>{" "}
                  citas
                </div>
                <div className="text-sm text-gray-600">
                  Ingresos:{" "}
                  <span className="font-semibold text-green-600">
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
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-500">
                      En tiempo real
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-2 sm:flex sm:space-x-3">
              <div className="bg-blue-50 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-center">
                <div className="text-xs sm:text-sm font-semibold text-blue-600">
                  {appointments.filter((a) => a.status === "CONFIRMED").length}
                </div>
                <div className="text-xs text-blue-500">Confirmadas</div>
              </div>
              <div className="bg-yellow-50 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-center">
                <div className="text-xs sm:text-sm font-semibold text-yellow-600">
                  {appointments.filter((a) => a.status === "PENDING").length}
                </div>
                <div className="text-xs text-yellow-500">Pendientes</div>
              </div>
              <div className="bg-green-50 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-center">
                <div className="text-xs sm:text-sm font-semibold text-green-600">
                  {appointments.filter((a) => a.status === "COMPLETED").length}
                </div>
                <div className="text-xs text-green-500">Completadas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Filters Section - Mobile First */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <AppointmentFilters
            searchTerm={searchTerm}
            filter={filter}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Appointments Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay citas
              </h3>
              <p className="text-gray-500 mb-6">
                {filter !== "all"
                  ? "No se encontraron citas con el filtro seleccionado"
                  : "Aún no tienes citas programadas"}
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors font-medium"
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
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
          className="w-14 h-14 bg-[#D4AF37] text-white rounded-full shadow-lg hover:bg-[#B8941F] transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
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
