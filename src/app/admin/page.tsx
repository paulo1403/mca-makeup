"use client";

import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  MessageSquare,
  Plus,
  Star,
  Truck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/appointments/StatusBadge";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRecentAppointments } from "@/hooks/useRecentAppointments";
import {
  formatPrice,
  formatServices,
  formatTime,
  getPriceBreakdown,
} from "@/utils/appointmentHelpers";
import type { Appointment } from "@/hooks/useAppointments";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

function DashboardContent() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: recent = [], isLoading: recentsLoading } = useRecentAppointments(5);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-20 rounded-xl bg-[color:var(--color-surface-elevated)] animate-pulse" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-[color:var(--color-surface-elevated)] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const kpis = [
    { label: "Hoy", value: stats.todayAppointments, icon: Calendar, color: "text-[color:var(--color-primary)]", bg: "bg-[color:var(--color-primary)]/10" },
    { label: "Pendientes", value: stats.pendingAppointments, icon: Clock3, color: "text-[color:var(--color-warning)]", bg: "bg-[color:var(--color-warning)]/10" },
    { label: "Confirmadas", value: stats.confirmedAppointments, icon: CheckCircle2, color: "text-[color:var(--color-success)]", bg: "bg-[color:var(--color-success)]/10" },
    { label: "Ingresos mes", value: currency.format(stats.completedRevenueThisMonth || 0), icon: CircleDollarSign, color: "text-[color:var(--color-accent)]", bg: "bg-[color:var(--color-accent)]/10", isCurrency: true },
  ];

  const quickActions = [
    { href: "/admin/citas", label: "Citas", sub: "Gestionar", icon: CalendarDays, color: "text-[color:var(--color-primary)]", bg: "bg-[color:var(--color-primary)]/10" },
    { href: "/admin/income", label: "Ingresos", sub: "Finanzas", icon: TrendingUp, color: "text-[color:var(--color-success)]", bg: "bg-[color:var(--color-success)]/10" },
    { href: "/admin/reviews", label: "Reseñas", sub: `${stats.pendingReviews} pend.`, icon: Star, color: "text-[color:var(--color-warning)]", bg: "bg-[color:var(--color-warning)]/10" },
    { href: "/admin/transport-costs", label: "Transporte", sub: "Tarifas", icon: Truck, color: "text-[color:var(--color-accent)]", bg: "bg-[color:var(--color-accent)]/10" },
  ];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_8%,transparent),transparent_60%)]" />
        <div className="relative">
          <p className="text-xs font-semibold tracking-widest text-[color:var(--color-muted)] uppercase">Panel</p>
          <h1 className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)] mt-1">
            ¡Hola Marcela!
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-[color:var(--color-body)]">
            <span>{stats.todayAppointments} cita{stats.todayAppointments !== 1 ? "s" : ""} hoy</span>
            <span className="text-[color:var(--color-border)] hidden sm:inline">·</span>
            <span>{stats.thisWeekAppointments} esta semana</span>
            <span className="text-[color:var(--color-border)] hidden sm:inline">·</span>
            <span>{stats.thisMonthAppointments} este mes</span>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
              <div className={`inline-flex rounded-lg p-2 ${k.bg} mb-3`}>
                <Icon className={`w-4 h-4 ${k.color}`} />
              </div>
              <p className="text-2xl font-bold text-[color:var(--color-heading)] tabular-nums">{k.value}</p>
              <p className="text-xs text-[color:var(--color-muted)] mt-1">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {quickActions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} href={a.href}
              className="group rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3.5 hover:border-[color:var(--color-primary)]/50 hover:bg-[color:var(--color-surface-elevated)] transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className={`rounded-lg p-1.5 ${a.bg}`}>
                  <Icon className={`w-4 h-4 ${a.color}`} />
                </div>
                <MessageSquare className="w-3 h-3 text-[color:var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm font-semibold text-[color:var(--color-heading)]">{a.label}</p>
              <p className="text-[11px] text-[color:var(--color-muted)]">{a.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Next appointments */}
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-border)]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[color:var(--color-primary)]" />
            <h2 className="text-sm font-semibold text-[color:var(--color-heading)]">Próximas citas</h2>
          </div>
          <Link href="/admin/citas" className="text-xs text-[color:var(--color-primary)] hover:underline font-medium">
            Ver todas
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
            <Link href="/admin/citas">
              <Button variant="primary" size="sm" className="mt-3">
                <Plus className="w-3.5 h-3.5" /> Nueva cita
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="hidden sm:block">
              <div className="divide-y divide-[color:var(--color-border)]">
                {recent.map((item) => {
                  const a = item as unknown as Appointment;
                  const pr = getPriceBreakdown(a);
                  const svc = formatServices(a).map((s) => s.displayText).join(", ");
                  return (
                    <Link key={a.id} href={`/admin/citas?highlightId=${a.id}`}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-[color:var(--color-surface-elevated)] transition-colors">
                      <div className="w-20 shrink-0">
                        <p className="text-xs font-semibold text-[color:var(--color-heading)]">
                          {formatTime(a.appointmentTime).split(" - ")[0]}
                        </p>
                        <p className="text-[10px] text-[color:var(--color-muted)]">
                          {new Date(a.appointmentDate).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
                        </p>
                      </div>
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
            </div>

            <div className="sm:hidden divide-y divide-[color:var(--color-border)]">
              {recent.map((item) => {
                const a = item as unknown as Appointment;
                const pr = getPriceBreakdown(a);
                const svc = formatServices(a).map((s) => s.displayText).join(", ");
                return (
                  <Link key={a.id} href={`/admin/citas?highlightId=${a.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[color:var(--color-surface-elevated)] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[color:var(--color-heading)] truncate">{a.clientName}</span>
                        <StatusBadge status={a.status} className="text-[10px] py-0" />
                      </div>
                      <p className="text-[11px] text-[color:var(--color-muted)] truncate mt-0.5">{svc}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[color:var(--color-muted)]">
                        <span>{formatTime(a.appointmentTime).split(" - ")[0]}</span>
                        <span>·</span>
                        <span>{new Date(a.appointmentDate).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}</span>
                        {pr.totalPrice > 0 && <><span>·</span><span className="font-medium text-[color:var(--color-heading)]">{formatPrice(pr.totalPrice)}</span></>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--color-muted)]">
        <span className="inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-[color:var(--color-success)]" />
          {stats.completedAppointments} completadas
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="w-3 h-3 text-[color:var(--color-warning)]" />
          {stats.averageRating ? `${Number(stats.averageRating).toFixed(1)} / 5` : "Sin reseñas"}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageSquare className="w-3 h-3 text-[color:var(--color-muted)]" />
          {stats.totalReviews} reseñas
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="h-20 rounded-xl bg-[color:var(--color-surface-elevated)] animate-pulse" />
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
