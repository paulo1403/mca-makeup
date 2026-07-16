"use client";

import { useSession } from "next-auth/react";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  MessageSquare,
  Plus,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/appointments/StatusBadge";
import ManualAppointmentModal from "@/components/appointments/ManualAppointmentModal";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRecentAppointments } from "@/hooks/useRecentAppointments";
import {
  formatPrice,
  formatServices,
  formatTime,
  getPriceBreakdown,
} from "@/utils/appointmentHelpers";
import type { Appointment } from "@/hooks/useAppointments";
import { useState } from "react";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

const currencyPrecise = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 2,
});

function DashboardContent() {
  const { data: session } = useSession();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: recent = [], isLoading: recentsLoading } = useRecentAppointments(5);
  const [showNewModal, setShowNewModal] = useState(false);

  const today = new Date();
  const dayName = today.toLocaleDateString("es-PE", { weekday: "long" });
  const dateStr = today.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-28 rounded-2xl bg-[color:var(--color-surface-elevated)] animate-pulse" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-[color:var(--color-surface-elevated)] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const firstName = session?.user?.name?.split(" ")[0] || "Marcela";

  const kpis = [
    { label: "Hoy", value: stats.todayAppointments, icon: Calendar, color: "border-l-[color:var(--color-primary)]", bg: "bg-[color:var(--color-primary)]/10", text: "text-[color:var(--color-primary)]" },
    { label: "Pendientes", value: stats.pendingAppointments, icon: Clock3, color: "border-l-[color:var(--color-warning)]", bg: "bg-[color:var(--color-warning)]/10", text: "text-[color:var(--color-warning)]" },
    { label: "Confirmadas", value: stats.confirmedAppointments, icon: CheckCircle2, color: "border-l-[color:var(--color-success)]", bg: "bg-[color:var(--color-success)]/10", text: "text-[color:var(--color-success)]" },
    { label: "Ingresos mes", value: currency.format(stats.completedRevenueThisMonth || 0), icon: CircleDollarSign, color: "border-l-[color:var(--color-accent)]", bg: "bg-[color:var(--color-accent)]/10", text: "text-[color:var(--color-accent)]" },
  ];

  const todayApps = recent.filter((item) => {
    const a = item as unknown as Appointment;
    const d = new Date(a.appointmentDate);
    return d.toDateString() === today.toDateString();
  });

  const lastMonthRevenue = stats.monthlyRevenueByIncome?.length
    ? stats.monthlyRevenueByIncome[stats.monthlyRevenueByIncome.length - 2]?.income || 0
    : 0;
  const revenueTrend = lastMonthRevenue > 0
    ? ((stats.completedRevenueThisMonth - lastMonthRevenue) / lastMonthRevenue * 100)
    : null;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-hidden">
        <div className="relative p-5 sm:p-6">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_10%,transparent)_0%,transparent_60%)]" />
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[color:var(--color-primary)] uppercase mb-1">
                {dayName} · {dateStr}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)]">
                ¡Hola {firstName}!
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-2 text-sm text-[color:var(--color-body)]">
                <span>{stats.todayAppointments} cita{stats.todayAppointments !== 1 ? "s" : ""} hoy</span>
                <span className="text-[color:var(--color-border)] hidden sm:inline">·</span>
                <span>{stats.thisWeekAppointments} esta semana</span>
                <span className="text-[color:var(--color-border)] hidden sm:inline">·</span>
                <span>{stats.thisMonthAppointments} este mes</span>
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowNewModal(true)}>
              <Plus className="w-3.5 h-3.5" /> Nueva cita
            </Button>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={`rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 border-l-[3px] ${k.color}`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`rounded-lg p-1.5 ${k.bg}`}>
                  <Icon className={`w-4 h-4 ${k.text}`} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)] tabular-nums">{k.value}</p>
              <p className="text-[11px] text-[color:var(--color-muted)] mt-0.5">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two-column: Today + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's schedule */}
        <div className="lg:col-span-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-border)]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[color:var(--color-primary)]" />
              <h2 className="text-sm font-semibold text-[color:var(--color-heading)]">Hoy</h2>
              {todayApps.length > 0 && (
                <span className="text-[10px] text-[color:var(--color-muted)] bg-[color:var(--color-surface-elevated)] px-1.5 py-0.5 rounded-full">
                  {todayApps.length}
                </span>
              )}
            </div>
            <Link href="/admin/appointments" className="text-xs text-[color:var(--color-primary)] hover:underline font-medium">
              Ver todas →
            </Link>
          </div>

          {recentsLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-lg bg-[color:var(--color-surface-elevated)] animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-8 h-8 text-[color:var(--color-muted)] mx-auto mb-2" />
              <p className="text-sm text-[color:var(--color-muted)]">No hay citas próximas</p>
              <Button variant="primary" size="sm" className="mt-3" onClick={() => setShowNewModal(true)}>
                <Plus className="w-3.5 h-3.5" /> Nueva cita
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[color:var(--color-border)]">
              {recent.map((item) => {
                const a = item as unknown as Appointment;
                const pr = getPriceBreakdown(a);
                const svc = formatServices(a).map((s) => s.displayText).join(", ");
                return (
                  <Link key={a.id} href={`/admin/appointments?highlightId=${a.id}&showDetail=true`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[color:var(--color-surface-elevated)] transition-colors group">
                    <div className="w-14 shrink-0 text-right">
                      <p className="text-xs font-bold text-[color:var(--color-primary)] tabular-nums">
                        {formatTime(a.appointmentTime).split(" - ")[0]}
                      </p>
                    </div>
                    <div className="w-[1px] self-stretch bg-[color:var(--color-border)]/50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[color:var(--color-heading)] truncate">{a.clientName}</p>
                      <p className="text-xs text-[color:var(--color-muted)] truncate">{svc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {pr.totalPrice > 0 && <p className="text-sm font-semibold text-[color:var(--color-heading)]">{formatPrice(pr.totalPrice)}</p>}
                    </div>
                    <StatusBadge status={a.status} className="text-[10px] shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Side cards */}
        <div className="space-y-4">
          {/* Revenue card */}
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg p-1.5 bg-[color:var(--color-accent)]/10">
                <TrendingUp className="w-4 h-4 text-[color:var(--color-accent)]" />
              </div>
              <div>
                <p className="text-xs text-[color:var(--color-muted)]">Ingresos del mes</p>
                <p className="text-lg font-bold text-[color:var(--color-heading)]">{currencyPrecise.format(stats.completedRevenueThisMonth)}</p>
              </div>
            </div>
            {revenueTrend !== null && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className={`inline-flex items-center gap-0.5 font-medium ${revenueTrend >= 0 ? "text-[color:var(--color-success)]" : "text-[color:var(--color-danger)]"}`}>
                  <ArrowUpRight className={`w-3 h-3 ${revenueTrend < 0 ? "rotate-180" : ""}`} />
                  {Math.abs(revenueTrend).toFixed(0)}%
                </span>
                <span className="text-[color:var(--color-muted)]">vs mes anterior</span>
              </div>
            )}
            {stats.monthlyRevenueByIncome && stats.monthlyRevenueByIncome.length > 0 && (
              <div className="flex items-end gap-1 mt-3 h-10">
                {stats.monthlyRevenueByIncome.slice(-6).map((m, i) => {
                  const maxVal = Math.max(...stats.monthlyRevenueByIncome.slice(-6).map((x) => x.income), 1);
                  const pct = (m.income / maxVal) * 100;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5" title={`${m.monthLabel}: ${currency.format(m.income)}`}>
                      <div className="w-full bg-[color:var(--color-accent)]/20 rounded-t-sm" style={{ height: `${Math.max(pct, 4)}%` }} />
                      <span className="text-[9px] text-[color:var(--color-muted)]">{m.monthLabel.slice(0, 3)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reviews card */}
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="rounded-lg p-1.5 bg-[color:var(--color-warning)]/10">
                <Star className="w-4 h-4 text-[color:var(--color-warning)]" />
              </div>
              <div>
                <p className="text-xs text-[color:var(--color-muted)]">Reseñas</p>
                <p className="text-lg font-bold text-[color:var(--color-heading)]">
                  {Number(stats.averageRating || 0).toFixed(1)}
                  <span className="text-sm font-normal text-[color:var(--color-muted)]"> / 5</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[color:var(--color-muted)]">
              <span>{stats.totalReviews} total</span>
              <span>·</span>
              <span>{stats.pendingReviews} pendientes</span>
            </div>
            <Link href="/admin/reviews" className="inline-flex items-center gap-1 mt-3 text-xs text-[color:var(--color-primary)] hover:underline font-medium">
              Gestionar reseñas <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Quick links */}
          <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
            <p className="text-xs font-semibold text-[color:var(--color-muted)] uppercase tracking-wider mb-3">Acceso rápido</p>
            <div className="space-y-1">
              {[
                { href: "/admin/appointments", label: "Citas", sub: "Gestionar reservas" },
                { href: "/admin/income", label: "Ingresos", sub: "Ver finanzas" },
                { href: "/admin/services", label: "Servicios", sub: "Catálogo y precios" },
                { href: "/admin/availability", label: "Disponibilidad", sub: "Horarios y fechas" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="flex items-center justify-between py-2 px-3 -mx-1 rounded-lg hover:bg-[color:var(--color-surface-elevated)] transition-colors group">
                  <div>
                    <p className="text-sm font-medium text-[color:var(--color-heading)]">{l.label}</p>
                    <p className="text-[11px] text-[color:var(--color-muted)]">{l.sub}</p>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[color:var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ManualAppointmentModal isOpen={showNewModal} onClose={() => setShowNewModal(false)} editingAppointment={null} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="h-28 rounded-2xl bg-[color:var(--color-surface-elevated)] animate-pulse" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-[color:var(--color-surface-elevated)] animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
