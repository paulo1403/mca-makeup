"use client";

import { Suspense } from "react";
import { useAppointmentsPage } from '@/hooks/useAppointmentsPage';
import AppointmentFilters from '@/components/appointments/AppointmentFilters';
import AppointmentTable from '@/components/appointments/AppointmentTable';
import Pagination from '@/components/appointments/Pagination';
import AppointmentModal from '@/components/appointments/AppointmentModal';
import LoadingSpinner from '@/components/appointments/LoadingSpinner';

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
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error al cargar las citas</h2>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'Ha ocurrido un error inesperado'}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner message="Cargando citas..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1C1C1C]">Gestión de Citas</h1>
        <div className="text-sm text-gray-600">
          Total: {pagination?.total || 0} citas
        </div>
      </div>

      <AppointmentFilters
        searchTerm={searchTerm}
        filter={filter}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />

      <AppointmentTable
        appointments={appointments}
        highlightedId={highlightedId}
        onViewDetails={handleViewDetails}
      />

      {pagination && (
        <Pagination
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}

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
