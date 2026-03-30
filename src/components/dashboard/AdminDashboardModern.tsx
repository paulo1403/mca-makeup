"use client";

import { Activity, ArrowUpRight, CalendarClock, CalendarDays, CheckCircle2, CircleDollarSign, Clock3, MessageSquare, Star, XCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRecentAppointments } from "@/hooks/useRecentAppointments";
import { formatDateTime, formatServices, getStatusText } from "@/utils/dashboardUtils";

const currency = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => currency.format(value || 0);

const surfaceCardClass =
  "border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] text-[color:var(--color-body)] shadow-none";

const elevatedCardClass =
  "border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)] shadow-none";

const quickActionCardClass =
  "group relative overflow-hidden rounded-xl border border-[color:var(--color-border)]/70 bg-[color:var(--color-surface)] p-3 text-[color:var(--color-body)] transition-all duration-200 hover:border-[color:var(--color-primary)]/50 hover:bg-[color:var(--color-surface-elevated)]";

const tabsListClass =
  "w-full justify-start rounded-xl border border-[color:var(--color-border)]/70 bg-[color:var(--color-surface)] p-1 text-[color:var(--color-body)] shadow-none dark:!border-[color:var(--color-border)] dark:!bg-[color:var(--color-surface)] sm:w-fit";

const tabsTriggerClass =
  "rounded-lg px-3 py-1.5 text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] dark:!text-[color:var(--color-muted)] dark:hover:!text-[color:var(--color-heading)] data-active:!border data-active:!border-[color:var(--color-border)] data-active:!bg-[color:var(--color-surface-elevated)] data-active:!text-[color:var(--color-heading)] dark:data-active:!border-[color:var(--color-border)] dark:data-active:!bg-[color:var(--color-surface-elevated)] dark:data-active:!text-[color:var(--color-heading)]";

const statusTone: Record<string, string> = {
  PENDING:
    "border-[color:var(--status-pending-border)] bg-[color:var(--status-pending-bg)] text-[color:var(--status-pending-text)]",
  CONFIRMED:
    "border-[color:var(--status-confirmed-border)] bg-[color:var(--status-confirmed-bg)] text-[color:var(--status-confirmed-text)]",
  COMPLETED:
    "border-[color:var(--status-completed-border)] bg-[color:var(--status-completed-bg)] text-[color:var(--status-completed-text)]",
  CANCELLED:
    "border-[color:var(--status-cancelled-border)] bg-[color:var(--status-cancelled-bg)] text-[color:var(--status-cancelled-text)]",
};

function DashboardLoading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <Skeleton className="h-72 w-full rounded-xl" />
    </div>
  );
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="border border-[color:var(--status-cancelled-border)]/60 bg-[color:var(--status-cancelled-bg)]/30 text-[color:var(--color-body)] shadow-none">
      <CardHeader>
        <CardTitle className="text-[color:var(--status-cancelled-text)]">No se pudo cargar el dashboard</CardTitle>
        <CardDescription>Hubo un problema obteniendo métricas y actividad reciente.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      </CardContent>
    </Card>
  );
}

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

  if (statsLoading && appointmentsLoading) {
    return <DashboardLoading />;
  }

  if (statsError || appointmentsError) {
    return (
      <div className="py-2">
        <DashboardError
          onRetry={() => {
            refetchStats();
            refetchAppointments();
          }}
        />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const appointmentCards = [
    {
      label: "Total citas",
      value: stats.totalAppointments,
      detail: `${stats.todayAppointments} hoy`,
      icon: Activity,
      accent: "text-[color:var(--color-primary)]",
      accentBg: "bg-[color:var(--color-primary)]/10",
    },
    {
      label: "Pendientes",
      value: stats.pendingAppointments,
      detail: "Requieren confirmación",
      icon: Clock3,
      accent: "text-[color:var(--status-pending-text)]",
      accentBg: "bg-[color:var(--status-pending-bg)]",
    },
    {
      label: "Confirmadas",
      value: stats.confirmedAppointments,
      detail: `${stats.thisWeekAppointments} esta semana`,
      icon: CalendarClock,
      accent: "text-[color:var(--status-confirmed-text)]",
      accentBg: "bg-[color:var(--status-confirmed-bg)]",
    },
    {
      label: "Completadas",
      value: stats.completedAppointments,
      detail: `${stats.thisMonthAppointments} este mes`,
      icon: CheckCircle2,
      accent: "text-[color:var(--status-completed-text)]",
      accentBg: "bg-[color:var(--status-completed-bg)]",
    },
  ];

  const quickActions = [
    {
      href: "/admin/calendar",
      title: "Ver calendario",
      subtitle: "Agenda mensual",
      icon: CalendarDays,
      tone: "text-[color:var(--color-accent)]",
      toneBg: "bg-[color:var(--color-accent)]/12",
    },
    {
      href: "/admin/appointments",
      title: "Gestionar citas",
      subtitle: "Estados y detalle",
      icon: Activity,
      tone: "text-[color:var(--color-primary)]",
      toneBg: "bg-[color:var(--color-primary)]/12",
    },
    {
      href: "/admin/income",
      title: "Revisar ingresos",
      subtitle: "Resumen financiero",
      icon: CircleDollarSign,
      tone: "text-[color:var(--status-confirmed-text)]",
      toneBg: "bg-[color:var(--status-confirmed-bg)]",
    },
    {
      href: "/admin/reviews",
      title: "Moderar reseñas",
      subtitle: "Reputación online",
      icon: MessageSquare,
      tone: "text-[color:var(--status-pending-text)]",
      toneBg: "bg-[color:var(--status-pending-bg)]",
    },
  ];

  const reviewCards = [
    { label: "Total reseñas", value: stats.totalReviews },
    { label: "Pendientes", value: stats.pendingReviews },
    { label: "Aprobadas", value: stats.approvedReviews },
    { label: "Rechazadas", value: stats.rejectedReviews },
    { label: "Públicas", value: stats.publicReviews },
    { label: "Promedio", value: `${Number(stats.averageRating || 0).toFixed(1)} / 5` },
  ];

  const statusRows = [
    { key: "PENDING", label: "Pendientes", value: stats.pendingAppointments },
    { key: "CONFIRMED", label: "Confirmadas", value: stats.confirmedAppointments },
    { key: "COMPLETED", label: "Completadas", value: stats.completedAppointments },
    { key: "CANCELLED", label: "Canceladas", value: stats.cancelledAppointments },
  ];

  const maxStatus = Math.max(...statusRows.map((item) => item.value), 1);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="relative overflow-hidden border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface)] text-[color:var(--color-body)] shadow-none">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface)),var(--color-surface))] opacity-95"
          aria-hidden="true"
        />
        <CardContent className="relative px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[color:var(--color-muted)] uppercase">
                Panel principal
              </p>
              <h1 className="mt-1 font-heading text-2xl text-[color:var(--color-heading)] sm:text-3xl">
                Vista general del negocio
              </h1>
              <p className="mt-2 text-sm text-[color:var(--color-body)]">
                Controla citas, ingresos y reputación desde un único tablero.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              <Badge variant="outline" className="justify-center border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] px-3 py-1 text-[color:var(--color-body)]">
                Hoy: {stats.todayAppointments}
              </Badge>
              <Badge variant="outline" className="justify-center border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] px-3 py-1 text-[color:var(--color-body)]">
                Semana: {stats.thisWeekAppointments}
              </Badge>
              <Badge variant="outline" className="justify-center border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] px-3 py-1 text-[color:var(--color-body)]">
                Mes: {stats.thisMonthAppointments}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {appointmentCards.map(({ label, value, detail, icon: Icon, accent, accentBg }) => (
          <Card key={label} className={surfaceCardClass}>
            <CardContent className="px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[color:var(--color-muted)]">{label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-[color:var(--color-heading)]">{value}</p>
                  <p className="mt-1 text-xs text-[color:var(--color-body)]">{detail}</p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border)]/50 ${accentBg}`}>
                  <Icon className={`h-[18px] w-[18px] ${accent}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link key={action.href} href={action.href} className={quickActionCardClass}>
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${action.toneBg}`}>
                  <Icon className={`h-4 w-4 ${action.tone}`} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[color:var(--color-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-[color:var(--color-heading)]">{action.title}</p>
              <p className="mt-0.5 text-xs text-[color:var(--color-muted)]">{action.subtitle}</p>
            </Link>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="gap-4">
        <TabsList className={tabsListClass}>
          <TabsTrigger value="overview" className={tabsTriggerClass}>
            Resumen
          </TabsTrigger>
          <TabsTrigger value="appointments" className={tabsTriggerClass}>
            Citas
          </TabsTrigger>
          <TabsTrigger value="reviews" className={tabsTriggerClass}>
            Reseñas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card className={surfaceCardClass}>
              <CardHeader>
                <CardTitle className="text-base">Ingresos</CardTitle>
                <CardDescription>Completadas: total y mes actual</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)] p-3">
                  <p className="text-xs text-[color:var(--color-muted)]">Total histórico</p>
                  <p className="text-xl font-semibold text-[color:var(--color-heading)]">
                    {formatCurrency(stats.completedRevenueTotal)}
                  </p>
                </div>
                <div className="rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)] p-3">
                  <p className="text-xs text-[color:var(--color-muted)]">Mes actual</p>
                  <p className="text-xl font-semibold text-[color:var(--color-heading)]">
                    {formatCurrency(stats.completedRevenueThisMonth)}
                  </p>
                </div>
                {stats.monthlyRevenueByIncome.length > 0 ? (
                  <p className="text-xs text-[color:var(--color-body)]">
                    Mejor mes: {stats.monthlyRevenueByIncome[0].monthLabel} con{" "}
                    <span className="font-semibold text-[color:var(--color-heading)]">
                      {formatCurrency(stats.monthlyRevenueByIncome[0].income)}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-[color:var(--color-muted)]">Aún no hay ingresos mensuales para mostrar.</p>
                )}
              </CardContent>
            </Card>

            <Card className={surfaceCardClass}>
              <CardHeader>
                <CardTitle className="text-base">Distribución por estado</CardTitle>
                <CardDescription>Comparativa rápida del flujo de citas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {statusRows.map((row) => {
                  const width = `${Math.max((row.value / maxStatus) * 100, row.value > 0 ? 10 : 0)}%`;

                  return (
                    <div key={row.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[color:var(--color-body)]">{row.label}</span>
                        <span className="font-semibold text-[color:var(--color-heading)]">{row.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[color:var(--color-surface-elevated)]">
                        <div
                          className={`h-2 rounded-full border ${statusTone[row.key] ?? ""}`}
                          style={{ width }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card className={surfaceCardClass}>
            <CardHeader>
              <CardTitle className="text-base">Citas recientes</CardTitle>
              <CardDescription>Últimas reservas registradas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Fecha y hora</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-8 text-center text-[color:var(--color-muted)]">
                          No hay citas recientes.
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentAppointments.map((appointment) => {
                        const services = formatServices(appointment);
                        const mainService = services[0]?.displayText || appointment.serviceType;

                        return (
                          <TableRow key={appointment.id}>
                            <TableCell>
                              <div className="font-medium text-[color:var(--color-heading)]">
                                {appointment.clientName}
                              </div>
                              <div className="text-xs text-[color:var(--color-muted)]">{appointment.clientPhone}</div>
                            </TableCell>
                            <TableCell className="max-w-[220px] truncate">{mainService}</TableCell>
                            <TableCell>{formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${statusTone[appointment.status] ?? ""}`}
                              >
                                {getStatusText(appointment.status)}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2 md:hidden">
                {recentAppointments.length === 0 ? (
                  <div className="rounded-lg border border-[color:var(--color-border)]/60 p-4 text-center text-sm text-[color:var(--color-muted)]">
                    No hay citas recientes.
                  </div>
                ) : (
                  recentAppointments.map((appointment) => {
                    const services = formatServices(appointment);
                    const mainService = services[0]?.displayText || appointment.serviceType;

                    return (
                      <div
                        key={appointment.id}
                        className="rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)] p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-[color:var(--color-heading)]">{appointment.clientName}</p>
                            <p className="text-xs text-[color:var(--color-body)]">{mainService}</p>
                          </div>
                          <span
                            className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] ${statusTone[appointment.status] ?? ""}`}
                          >
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-[color:var(--color-muted)]">
                          {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Link href="/admin/appointments">
              <Button variant="soft" className="bg-[color:var(--color-surface-elevated)] text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface)]">Ir a todas las citas</Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card className={surfaceCardClass}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-4 w-4 text-[color:var(--color-accent)]" />
                Métricas de reseñas
              </CardTitle>
              <CardDescription>Seguimiento de reputación y moderación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {reviewCards.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)] p-3"
                  >
                    <p className="text-xs text-[color:var(--color-muted)]">{item.label}</p>
                    <p className="mt-1 text-lg font-semibold text-[color:var(--color-heading)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={surfaceCardClass}>
            <CardHeader>
              <CardTitle className="text-base">Histórico mensual de ingresos</CardTitle>
              <CardDescription>Basado en citas completadas por mes</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.monthlyRevenueByIncome.length === 0 ? (
                <p className="text-sm text-[color:var(--color-muted)]">No hay datos mensuales disponibles.</p>
              ) : (
                <div className="space-y-2">
                  {stats.monthlyRevenueByIncome.slice(0, 6).map((month) => (
                    <div
                      key={month.month}
                      className="flex items-center justify-between rounded-lg border border-[color:var(--color-border)]/60 bg-[color:var(--color-surface-elevated)] px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-[color:var(--color-heading)]">{month.monthLabel}</p>
                        <p className="text-xs text-[color:var(--color-muted)]">
                          {month.completedAppointments} completadas
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[color:var(--color-heading)]">
                        {formatCurrency(month.income)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Link href="/admin/reviews">
              <Button variant="soft" className="bg-[color:var(--color-surface-elevated)] text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface)]">Gestionar reseñas</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>

      <Card className={elevatedCardClass}>
        <CardContent className="flex flex-col gap-2 py-4 text-xs text-[color:var(--color-body)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Datos sincronizados automáticamente cada 30 minutos.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-[color:var(--status-completed-text)]" />
              Completadas: {stats.completedAppointments}
            </span>
            <span className="inline-flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5 text-[color:var(--status-cancelled-text)]" />
              Canceladas: {stats.cancelledAppointments}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
