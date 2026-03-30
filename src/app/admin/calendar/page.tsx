"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isValid,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  Phone,
  User2,
  XCircle,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface CalendarAppointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  service: string;
  status: AppointmentStatus;
  notes: string;
  servicePrice: number;
  transportCost: number;
  totalPrice: number;
  totalDuration: number;
  services: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
    category: string;
  }>;
}

interface ProcessedAppointment extends CalendarAppointment {
  startDate: Date;
  endDate: Date;
}

function capitalize(text: string) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getStatusMeta(status: AppointmentStatus) {
  const lower = status.toLowerCase();
  const labels: Record<AppointmentStatus, string> = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmada",
    COMPLETED: "Completada",
    CANCELLED: "Cancelada",
  };

  return {
    label: labels[status],
    style: {
      backgroundColor: `var(--status-${lower}-bg)`,
      color: `var(--status-${lower}-text)`,
      borderColor: `var(--status-${lower}-border)`,
    } as React.CSSProperties,
  };
}

function formatStartTime(timeRange: string) {
  return (timeRange || "").split(" - ")[0] || timeRange;
}

function AppointmentDetailDialog({
  appointment,
  open,
  onOpenChange,
  onUpdateStatus,
  isUpdating,
}: {
  appointment: ProcessedAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  isUpdating: boolean;
}) {
  if (!appointment) return null;

  const statusMeta = getStatusMeta(appointment.status);
  const hasMultipleServices = appointment.services?.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-[color:var(--color-surface)] text-[color:var(--color-heading)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[color:var(--color-heading)]">
            <User2 className="h-4 w-4" />
            {appointment.clientName}
          </DialogTitle>
          <DialogDescription className="text-[color:var(--color-body)]">
            Detalle completo de la cita
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border px-3 py-1 text-xs font-semibold" style={statusMeta.style}>
              {statusMeta.label}
            </span>
            <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] px-3 py-1 text-xs font-semibold text-[color:var(--color-heading)]">
              S/ {appointment.totalPrice}
            </span>
          </div>

          <div className="grid gap-3 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-3">
            <div className="flex items-center gap-2 text-sm text-[color:var(--color-body)]">
              <Clock3 className="h-4 w-4" />
              {capitalize(format(appointment.startDate, "EEEE d 'de' MMMM yyyy", { locale: es }))} - {appointment.time}
            </div>
            <div className="flex items-center gap-2 text-sm text-[color:var(--color-body)]">
              <Mail className="h-4 w-4" />
              {appointment.clientEmail}
            </div>
            <div className="flex items-center gap-2 text-sm text-[color:var(--color-body)]">
              <Phone className="h-4 w-4" />
              {appointment.clientPhone}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
              {hasMultipleServices ? "Servicios" : "Servicio"}
            </p>
            <div className="space-y-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-3">
              {hasMultipleServices ? (
                appointment.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[color:var(--color-heading)]">{service.name}</p>
                      <p className="text-xs text-[color:var(--color-muted)]">{service.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-[color:var(--color-body)]">S/ {service.price}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-medium text-[color:var(--color-heading)]">{appointment.service}</p>
              )}
            </div>
          </div>

          {appointment.notes ? (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-muted)]">
                Notas
              </p>
              <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-3 text-sm text-[color:var(--color-body)]">
                {appointment.notes}
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="gap-2 bg-[color:var(--color-surface-elevated)]">
          {appointment.status === "PENDING" ? (
            <Button
              variant="soft"
              className="border"
              style={{
                borderColor: "var(--status-confirmed-border)",
                color: "var(--status-confirmed-text)",
                backgroundColor: "var(--status-confirmed-bg)",
              }}
              disabled={isUpdating}
              onClick={() => onUpdateStatus(appointment.id, "CONFIRMED")}
            >
              {isUpdating ? "Confirmando..." : "Confirmar"}
            </Button>
          ) : null}

          {appointment.status === "PENDING" || appointment.status === "CONFIRMED" ? (
            <Button
              variant="soft"
              className="border"
              style={{
                borderColor: "var(--status-completed-border)",
                color: "var(--status-completed-text)",
                backgroundColor: "var(--status-completed-bg)",
              }}
              disabled={isUpdating}
              onClick={() => onUpdateStatus(appointment.id, "COMPLETED")}
            >
              {isUpdating ? "Completando..." : "Completar"}
            </Button>
          ) : null}

          {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" ? (
            <Button
              variant="soft"
              className="border"
              style={{
                borderColor: "var(--status-cancelled-border)",
                color: "var(--status-cancelled-text)",
                backgroundColor: "var(--status-cancelled-bg)",
              }}
              disabled={isUpdating}
              onClick={() => onUpdateStatus(appointment.id, "CANCELLED")}
            >
              {isUpdating ? "Cancelando..." : "Cancelar"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminCalendarPage() {
  const queryClient = useQueryClient();

  const [visibleMonth, setVisibleMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<ProcessedAppointment | null>(null);

  const monthKey = format(visibleMonth, "yyyy-MM");

  const { data: appointmentsRaw = [], isLoading, error } = useQuery<CalendarAppointment[]>({
    queryKey: ["admin-calendar-appointments", monthKey],
    queryFn: async () => {
      const startDate = format(startOfMonth(visibleMonth), "yyyy-MM-dd");
      const endDate = format(endOfMonth(visibleMonth), "yyyy-MM-dd");

      const res = await fetch(
        `/api/admin/appointments/calendar?startDate=${startDate}&endDate=${endDate}`,
      );

      if (!res.ok) throw new Error("No se pudieron cargar las citas del calendario");

      return res.json();
    },
    staleTime: 3 * 60 * 1000,
  });

  const parseAppointmentDateTime = useCallback((dateStr: string, timeStr: string) => {
    try {
      const baseDate = parseISO(dateStr);
      if (!isValid(baseDate)) return null;

      const [startTime] = (timeStr || "").split(" - ");
      const match = startTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return null;

      let hours = Number.parseInt(match[1], 10);
      const minutes = Number.parseInt(match[2], 10);
      const period = match[3].toUpperCase();

      if (period === "AM" && hours === 12) hours = 0;
      if (period === "PM" && hours !== 12) hours += 12;

      const startDate = new Date(baseDate);
      startDate.setHours(hours, minutes, 0, 0);

      return startDate;
    } catch {
      return null;
    }
  }, []);

  const appointments = useMemo<ProcessedAppointment[]>(() => {
    return appointmentsRaw
      .map((item) => {
        const startDate = parseAppointmentDateTime(item.date, item.time);
        if (!startDate) return null;

        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + (item.totalDuration || 120));

        return {
          ...item,
          startDate,
          endDate,
        };
      })
      .filter((x): x is ProcessedAppointment => x !== null)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [appointmentsRaw, parseAppointmentDateTime]);

  const appointmentsByDay = useMemo(() => {
    const grouped = new Map<string, ProcessedAppointment[]>();

    for (const apt of appointments) {
      const key = format(apt.startDate, "yyyy-MM-dd");
      const dayList = grouped.get(key) ?? [];
      dayList.push(apt);
      grouped.set(key, dayList);
    }

    for (const [, dayList] of grouped) {
      dayList.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    }

    return grouped;
  }, [appointments]);

  const selectedDayAppointments = useMemo(() => {
    return appointments.filter((apt) => isSameDay(apt.startDate, selectedDate));
  }, [appointments, selectedDate]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "PENDING").length,
      confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
      completed: appointments.filter((a) => a.status === "COMPLETED").length,
      cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
    };
  }, [appointments]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      const res = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar el estado");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-calendar-appointments"] });
      setSelectedAppointment(null);
    },
  });

  const appointmentDays = useMemo(() => appointments.map((a) => a.startDate), [appointments]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Card className="max-w-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-center">
          <CardHeader>
            <CardTitle className="text-[color:var(--status-cancelled-text)]">Error del calendario</CardTitle>
            <CardDescription className="text-[color:var(--color-body)]">
              No se pudo cargar la información de citas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] p-2 md:p-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:gap-6">
        <Card className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)]">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-6 w-6 text-[color:var(--color-primary)]" />
                <div>
                  <CardTitle className="text-2xl md:text-3xl">Calendario de Citas</CardTitle>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="default" className="h-8 px-3 text-sm font-semibold">
                  {stats.total} {stats.total === 1 ? "cita" : "citas"}
                </Badge>
                <Button
                  variant="soft"
                  className="border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] text-[color:var(--color-heading)] hover:opacity-90"
                  onClick={() => {
                    const now = new Date();
                    setVisibleMonth(now);
                    setSelectedDate(now);
                  }}
                >
                  Hoy
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-lg border border-[var(--status-pending-border)] px-3 py-2 text-sm" style={{ backgroundColor: "var(--status-pending-bg)", color: "var(--status-pending-text)" }}>
                Pendientes: <strong>{stats.pending}</strong>
              </div>
              <div className="rounded-lg border border-[var(--status-confirmed-border)] px-3 py-2 text-sm" style={{ backgroundColor: "var(--status-confirmed-bg)", color: "var(--status-confirmed-text)" }}>
                Confirmadas: <strong>{stats.confirmed}</strong>
              </div>
              <div className="rounded-lg border border-[var(--status-completed-border)] px-3 py-2 text-sm" style={{ backgroundColor: "var(--status-completed-bg)", color: "var(--status-completed-text)" }}>
                Completadas: <strong>{stats.completed}</strong>
              </div>
              <div className="rounded-lg border border-[var(--status-cancelled-border)] px-3 py-2 text-sm" style={{ backgroundColor: "var(--status-cancelled-bg)", color: "var(--status-cancelled-text)" }}>
                Canceladas: <strong>{stats.cancelled}</strong>
              </div>
              <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] px-3 py-2 text-sm text-[color:var(--color-body)]">
                Mes: <strong>{capitalize(format(visibleMonth, "MMMM yyyy", { locale: es }))}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[360px,1fr]">
          <Card className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => setVisibleMonth((prev) => subMonths(prev, 1))}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <CardTitle className="text-lg capitalize">
                  {format(visibleMonth, "MMMM yyyy", { locale: es })}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setVisibleMonth((prev) => addMonths(prev, 1))}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) setSelectedDate(date);
                }}
                month={visibleMonth}
                onMonthChange={setVisibleMonth}
                locale={es}
                hideNavigation
                className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)]"
                classNames={{
                  months: "w-full",
                  month: "w-full space-y-4",
                  caption: "hidden",
                  caption_label: "hidden",
                  month_grid: "w-full border-collapse",
                  weekdays: "grid w-full grid-cols-7",
                  weekday:
                    "w-full text-center text-[0.85rem] font-semibold text-[color:var(--calendar-label)]",
                  week: "mt-2 grid w-full grid-cols-7",
                  day: "h-10 w-full p-0 text-sm font-medium text-[color:var(--color-heading)]",
                  day_button:
                    "h-10 w-full rounded-md text-sm font-medium text-[color:var(--color-heading)] aria-selected:text-white",
                }}
                modifiers={{
                  hasAppointments: appointmentDays,
                }}
                modifiersClassNames={{
                  hasAppointments: "ring-2 ring-[color:var(--color-primary)]/45 ring-offset-1",
                }}
              />
              <p className="mt-3 text-xs text-[color:var(--color-muted)]">
                Los días con citas tienen un borde destacado.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-heading)]">
            <CardHeader>
              <CardTitle>
                {capitalize(format(selectedDate, "EEEE d 'de' MMMM", { locale: es }))}
              </CardTitle>
              <CardDescription className="text-[color:var(--color-body)]">
                Gestión de citas del día seleccionado y del mes actual.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="day" className="w-full gap-4">
                <TabsList className="w-fit bg-[color:var(--color-surface-elevated)] text-[color:var(--color-body)]">
                  <TabsTrigger
                    value="day"
                    className="text-[color:var(--color-body)] hover:text-[color:var(--color-heading)] data-active:border data-active:border-[color:var(--color-border)] data-active:bg-[color:var(--color-surface)] data-active:text-[color:var(--color-heading)]"
                  >
                    Día seleccionado
                  </TabsTrigger>
                  <TabsTrigger
                    value="month"
                    className="text-[color:var(--color-body)] hover:text-[color:var(--color-heading)] data-active:border data-active:border-[color:var(--color-border)] data-active:bg-[color:var(--color-surface)] data-active:text-[color:var(--color-heading)]"
                  >
                    Todas del mes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="day" className="space-y-3">
                  {selectedDayAppointments.length === 0 ? (
                    <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-8 text-center">
                      <CalendarIcon className="mx-auto mb-3 h-10 w-10 text-[color:var(--color-muted)]/60" />
                      <p className="text-sm text-[color:var(--color-body)]">No hay citas para esta fecha.</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 md:hidden">
                        {selectedDayAppointments.map((apt) => {
                          const status = getStatusMeta(apt.status);
                          return (
                            <button
                              key={apt.id}
                              type="button"
                              onClick={() => setSelectedAppointment(apt)}
                              className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-3 text-left transition-all hover:opacity-95"
                            >
                              <div className="mb-2 flex items-center justify-between gap-2">
                                <p className="font-semibold text-[color:var(--color-heading)]">{apt.clientName}</p>
                                <span className="rounded-full border px-2 py-0.5 text-[11px] font-semibold" style={status.style}>
                                  {status.label}
                                </span>
                              </div>
                              <p className="text-sm text-[color:var(--color-body)]">{formatStartTime(apt.time)}</p>
                              <p className="text-xs text-[color:var(--color-muted)]">{apt.service}</p>
                              <p className="mt-1 text-sm font-semibold text-[color:var(--color-heading)]">S/ {apt.totalPrice}</p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="hidden md:block">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Hora</TableHead>
                              <TableHead>Cliente</TableHead>
                              <TableHead>Servicio</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedDayAppointments.map((apt) => {
                              const status = getStatusMeta(apt.status);
                              return (
                                <TableRow
                                  key={apt.id}
                                  className="cursor-pointer"
                                  onClick={() => setSelectedAppointment(apt)}
                                >
                                  <TableCell>{formatStartTime(apt.time)}</TableCell>
                                  <TableCell className="font-medium">{apt.clientName}</TableCell>
                                  <TableCell>{apt.service}</TableCell>
                                  <TableCell>
                                    <span className="rounded-full border px-2 py-0.5 text-xs font-semibold" style={status.style}>
                                      {status.label}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">S/ {apt.totalPrice}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="month" className="space-y-3">
                  {appointments.length === 0 ? (
                    <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-8 text-center">
                      <CalendarIcon className="mx-auto mb-3 h-10 w-10 text-[color:var(--color-muted)]/60" />
                      <p className="text-sm text-[color:var(--color-body)]">No hay citas este mes.</p>
                    </div>
                  ) : (
                    appointments.map((apt) => {
                      const status = getStatusMeta(apt.status);
                      return (
                        <button
                          key={apt.id}
                          type="button"
                          onClick={() => {
                            setSelectedDate(apt.startDate);
                            setSelectedAppointment(apt);
                          }}
                          className={cn(
                            "w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] p-3 text-left transition-all hover:opacity-95",
                          )}
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-[color:var(--color-heading)]">{apt.clientName}</p>
                              <p className="text-sm text-[color:var(--color-body)]">
                                {capitalize(format(apt.startDate, "EEE d MMM", { locale: es }))} - {formatStartTime(apt.time)}
                              </p>
                              <p className="text-xs text-[color:var(--color-muted)]">{apt.service}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full border px-2 py-0.5 text-xs font-semibold" style={status.style}>
                                {status.label}
                              </span>
                              <span className="text-sm font-semibold text-[color:var(--color-heading)]">S/ {apt.totalPrice}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        open={Boolean(selectedAppointment)}
        onOpenChange={(open) => {
          if (!open) setSelectedAppointment(null);
        }}
        onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
        isUpdating={updateStatusMutation.isPending}
      />
    </div>
  );
}
