"use client";

import { addDays, endOfMonth, format as dfFormat } from "date-fns";
import { CalendarCheck, Check, ChevronDown, Plus, Search, X, XCircle } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import AppointmentModal from "@/components/appointments/AppointmentModal";
import AppointmentTable from "@/components/appointments/AppointmentTable";
import ManualAppointmentModal from "@/components/appointments/ManualAppointmentModal";
import Pagination from "@/components/appointments/Pagination";
import { Button } from "@/components/ui/Button";
import { useAppointmentsPage } from "@/hooks/useAppointmentsPage";
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
  const [period, setPeriod] = useState("all");
  const [showManualModal, setShowManualModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);

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
    return <AppointmentsSkeleton />;
  }

  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-[color:var(--color-app-bg)]">
      <div className="sticky top-0 z-10 bg-[color:var(--color-surface)]/80 backdrop-blur-md border-b border-[color:var(--color-border)]">
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-base font-bold text-[color:var(--color-heading)] shrink-0">Citas</h1>
              <span className="text-[11px] text-[color:var(--color-muted)] tabular-nums">{pagination?.total || 0}</span>
              {completedCount > 0 && <><span className="text-[color:var(--color-border)]">·</span><span className="text-[11px] text-[color:var(--color-success)]">✓{completedCount}</span></>}
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowManualModal(true)}>
              <Plus className="w-3.5 h-3.5" /> Nueva
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 -ml-2">
              {DATE_TABS.map((t) => (
                <button key={t.k} onClick={() => setPeriod(t.k)}
                  className={`relative px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    period === t.k
                      ? "text-[color:var(--color-heading)] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-[color:var(--color-primary)]"
                      : "text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)]"
                  }`}
                >
                  {t.l}
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w-[180px] ml-auto">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[color:var(--color-muted)]" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-7 pr-5 py-1.5 text-xs rounded-md bg-[color:var(--color-surface-elevated)] text-[color:var(--color-heading)] placeholder-[color:var(--color-muted)] border border-[color:var(--color-border)]/50 focus:outline-none focus:border-[color:var(--color-border)]"
              />
              {searchTerm && <button onClick={() => handleSearchChange("")} className="absolute right-1.5 top-1/2 -translate-y-1/2"><X className="w-3 h-3 text-[color:var(--color-muted)]" /></button>}
            </div>
            <div className="relative">
              <button onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md border border-[color:var(--color-border)]/50 bg-[color:var(--color-surface-elevated)] text-[color:var(--color-heading)] hover:border-[color:var(--color-border)] transition-colors"
              >
                {FILTERS.find((f) => f.value === filter)?.label || "Todas"}
                <ChevronDown className="w-3 h-3 text-[color:var(--color-muted)]" />
              </button>
              {statusOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                  <div className="absolute right-0 mt-1 w-36 bg-[color:var(--color-surface)] rounded-lg shadow-lg border border-[color:var(--color-border)] z-50 overflow-hidden">
                    {FILTERS.map((item) => (
                      <button key={item.value}
                        onClick={() => { handleFilterChange(item.value); setStatusOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-[color:var(--color-surface-elevated)] ${
                          filter === item.value ? "text-[color:var(--color-primary)] font-medium bg-[color:var(--color-primary)]/5" : "text-[color:var(--color-body)]"
                        }`}>
                        {item.label}
                        {filter === item.value && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-0 py-3 space-y-3">
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
    <Suspense fallback={<AppointmentsSkeleton />}>
      <AppointmentsContent />
    </Suspense>
  );
}

function AppointmentsSkeleton() {
  return (
    <div className="min-h-screen bg-[color:var(--color-app-bg)]">
      <div className="sticky top-0 z-10 bg-[color:var(--color-surface)]/80 backdrop-blur-md border-b border-[color:var(--color-border)]">
        <div className="px-4 py-2.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="h-5 w-14 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
              <div className="h-3 w-6 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
            </div>
            <div className="h-8 w-20 rounded-lg bg-[color:var(--color-surface-elevated)] animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 -ml-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-12 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
              ))}
            </div>
            <div className="h-8 w-32 rounded ml-auto bg-[color:var(--color-surface-elevated)] animate-pulse" />
            <div className="h-8 w-24 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
          </div>
        </div>
      </div>
      <div className="px-0 py-3 space-y-3">
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <div className="px-4 py-3 border-b border-[color:var(--color-border)]">
            <div className="flex gap-8">
              {["Cliente", "Servicio", "Fecha", "Precio", "Estado", "Acciones"].map((h) => (
                <div key={h} className="h-3 w-16 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
              ))}
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-4 py-3 border-b border-[color:var(--color-border)]/50 last:border-b-0">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-[color:var(--color-surface-elevated)] animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-28 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
                  <div className="h-3 w-20 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
                </div>
                <div className="h-3 w-16 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
                <div className="h-3 w-24 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
                <div className="h-3 w-12 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
                <div className="h-3 w-14 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
                <div className="flex gap-1">
                  <div className="h-8 w-8 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
                  <div className="h-8 w-8 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
                  <div className="h-8 w-8 rounded bg-[color:var(--color-surface-elevated)] animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
