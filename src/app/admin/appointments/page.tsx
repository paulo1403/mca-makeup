"use client";

import { addDays, endOfMonth, format as dfFormat } from "date-fns";
import { CalendarCheck, CheckCircle2, ChevronDown, Clock, MessageCircle, Plus, XCircle } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import AppointmentModal from "@/components/appointments/AppointmentModal";
import AppointmentTable from "@/components/appointments/AppointmentTable";
import LoadingSpinner from "@/components/appointments/LoadingSpinner";
import ManualAppointmentModal from "@/components/appointments/ManualAppointmentModal";
import Pagination from "@/components/appointments/Pagination";
import { Button } from "@/components/ui/Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAppointmentsPage } from "@/hooks/useAppointmentsPage";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import type { Appointment } from "@/hooks/useAppointments";

const FILTERS = [
  { value: "all", label: "Todas" },
  { value: "PENDING", label: "Pendientes" },
  { value: "CONFIRMED", label: "Confirmadas" },
  { value: "COMPLETED", label: "Completadas" },
  { value: "CANCELLED", label: "Canceladas" },
] as const;

const DATE_TABS = [
  { k: "today", l: "Hoy" },
  { k: "week", l: "Semana" },
  { k: "month", l: "Mes" },
  { k: "all", l: "Todas" },
] as const;

function getDateRange(period: string) {
  const now = new Date();
  const fmt = (d: Date) => dfFormat(d, "yyyy-MM-dd");
  if (period === "today") return { dateStart: fmt(now), dateEnd: fmt(now) };
  if (period === "week") return { dateStart: fmt(now), dateEnd: fmt(addDays(now, 7)) };
  if (period === "month") return { dateStart: fmt(now), dateEnd: fmt(endOfMonth(now)) };
  return null;
}

function AppointmentsContent() {
  const [showManualModal, setShowManualModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { data: dashboardStats } = useDashboardStats();
  const [period, setPeriod] = useState("all");

  const range = useMemo(() => getDateRange(period), [period]);

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
  } = useAppointmentsPage(range?.dateStart, range?.dateEnd);

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowManualModal(true);
  };

  const handleCloseEditModal = () => {
    setShowManualModal(false);
    setEditingAppointment(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[color:var(--color-app-bg)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 bg-[color:var(--color-danger)]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-7 h-7 text-[color:var(--color-danger)]" />
          </div>
          <h2 className="text-lg font-semibold text-[color:var(--color-heading)] mb-1">
            Error al cargar las citas
          </h2>
          <p className="text-sm text-[color:var(--color-muted)] mb-5">
            {error instanceof Error ? error.message : "Ha ocurrido un error inesperado"}
          </p>
          <Button variant="primary" size="md" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
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

  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-[color:var(--color-app-bg)]">
      <div className="sticky top-0 z-10 bg-[color:var(--color-surface)]/80 backdrop-blur-md border-b border-[color:var(--color-border)]">
        <div className="px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)]">
                Citas
              </h1>
              <span className="text-xs text-[color:var(--color-muted)] bg-[color:var(--color-accent-soft)] px-2 py-0.5 rounded-full">
                {pagination?.total || 0}
              </span>
            </div>
            <Button variant="primary" size="md" onClick={() => setShowManualModal(true)}>
              <Plus className="w-4 h-4" />
              Nueva cita
            </Button>
          </div>

          <KpiRow confirmed={confirmedCount} pending={pendingCount} completed={completedCount} />

          <div className="flex items-center gap-1.5 mt-2">
            {DATE_TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setPeriod(t.k)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  period === t.k
                    ? "bg-[color:var(--color-primary)] text-white"
                    : "text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface-elevated)]"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>

          <Collapsible className="mt-2">
            <CollapsibleTrigger className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] hover:bg-[color:var(--color-accent-soft)]/50 transition-colors">
              <span>Ingresos del mes</span>
              <ChevronDown className="w-3 h-3 transition-transform group-data-[panel-open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex items-center justify-between pt-2 text-sm">
                <span className="text-[color:var(--color-muted)]">Total:</span>
                <span className="font-semibold text-[color:var(--color-success)]">
                  {currencyFormatter.format(monthlyRevenue)}
                </span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div className="px-0 py-3 space-y-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--color-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar cliente o servicio..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[color:var(--color-surface)] text-[color:var(--color-heading)] placeholder-[color:var(--color-muted)] border border-[color:var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/40 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => {
            const isActive = filter === item.value;
            const key = item.value.toLowerCase();
            let cls = "shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors";
            if (isActive) {
              if (item.value === "all") {
                cls += " bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]";
              } else {
                cls += ` bg-[var(--status-${key}-bg)] text-[var(--status-${key}-text)] border-[var(--status-${key}-border)]`;
              }
            } else {
              cls += " bg-[color:var(--color-surface)] text-[color:var(--color-muted)] border-[color:var(--color-border)] hover:text-[color:var(--color-heading)]";
            }
            return (
              <button key={item.value} type="button" onClick={() => handleFilterChange(item.value)} className={cls}>
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="min-w-0">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-[color:var(--color-accent-soft)] rounded-xl flex items-center justify-center mx-auto mb-3">
                <CalendarCheck className="w-6 h-6 text-[color:var(--color-primary)]/60" />
              </div>
              <p className="text-sm text-[color:var(--color-muted)] mb-4">
                {filter !== "all"
                  ? "No se encontraron citas con el filtro seleccionado"
                  : "Aún no tienes citas programadas"}
              </p>
              <Button variant="outline" size="md" onClick={() => setShowManualModal(true)}>
                <Plus className="w-4 h-4" />
                Crear primera cita
              </Button>
            </div>
          ) : (
            <AppointmentTable
              appointments={appointments}
              highlightedId={highlightedId || undefined}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
            />
          )}
        </div>

        {pagination && pagination.pages > 1 && (
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={showModal}
        onClose={handleCloseModal}
        onEdit={handleEdit}
      />

      <ManualAppointmentModal
        isOpen={showManualModal}
        onClose={handleCloseEditModal}
        editingAppointment={editingAppointment}
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

function KpiRow({ confirmed, pending, completed }: { confirmed: number; pending: number; completed: number }) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-[color:var(--color-muted)]">
      <span>
        <strong className="text-[color:var(--color-heading)]">{confirmed}</strong> Confirmada{confirmed !== 1 ? "s" : ""}
      </span>
      <span className="text-[color:var(--color-border)]">·</span>
      <span>
        <strong className="text-[color:var(--color-heading)]">{pending}</strong> Pendiente{pending !== 1 ? "s" : ""}
      </span>
      <span className="text-[color:var(--color-border)]">·</span>
      <span>
        <strong className="text-[color:var(--color-heading)]">{completed}</strong> Completada{completed !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
