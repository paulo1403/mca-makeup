"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  isValid,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  XCircle,
  List,
  Grid,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

// Interfaces
interface CalendarAppointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  service: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
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

// Componente de Modal minimalista
const AppointmentModal = ({
  appointment,
  isOpen,
  onClose,
  onUpdateStatus,
  isUpdating = false,
}: {
  appointment: ProcessedAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  isUpdating?: boolean;
}) => {
  if (!isOpen || !appointment) return null;

  const getStatusInfo = (status: string) => {
    const lower = (status || "PENDING").toLowerCase();
    const labels = {
      PENDING: "Pendiente",
      CONFIRMED: "Confirmada",
      COMPLETED: "Completada",
      CANCELLED: "Cancelada",
    } as const;
    return {
      label: labels[status as keyof typeof labels] ?? "Pendiente",
      style: {
        backgroundColor: `var(--status-${lower}-bg)`,
        color: `var(--status-${lower}-text)`,
        borderColor: `var(--status-${lower}-border)`,
      } as React.CSSProperties,
    };
  };

  const statusInfo = getStatusInfo(appointment.status);
  const hasMultipleServices =
    appointment.services && appointment.services.length > 1;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-[var(--color-border)]">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-heading">
                {appointment.clientName}
              </h3>
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-medium border mt-2"
                style={statusInfo.style}
              >
                {statusInfo.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-2 rounded-full transition-colors"
            >
              <XCircle className="w-5 h-5 text-muted" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
          {/* Información básica */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted">Fecha y hora</p>
              <p className="font-medium text-heading">
                {format(appointment.startDate, "EEEE, d 'de' MMMM", {
                  locale: es,
                })}
              </p>
              <p className="text-sm text-main">{appointment.time}</p>
            </div>

            <div>
              <p className="text-sm text-muted">Contacto</p>
              <p className="text-heading">{appointment.clientEmail}</p>
              <p className="text-heading">{appointment.clientPhone}</p>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <p className="text-sm text-muted mb-2">
              {hasMultipleServices ? "Servicios" : "Servicio"}
            </p>
            <div className="bg-surface-2 rounded-lg p-3">
              {hasMultipleServices ? (
                <div className="space-y-2">
                  {appointment.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-heading">
                          {service.name}
                        </p>
                        <p className="text-xs text-muted">
                          {service.category}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-main">
                        S/ {service.price}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-medium text-heading">
                  {appointment.service}
                </p>
              )}
            </div>
          </div>

          {/* Precios */}
          <div>
            <p className="text-sm text-muted mb-2">Desglose de precios</p>
            <div className="rounded-lg p-3 space-y-2 border border-[var(--color-border)] bg-surface-2">
              <div className="flex justify-between text-sm text-main">
                <span>Servicios:</span>
                <span>S/ {appointment.servicePrice}</span>
              </div>
              {appointment.transportCost > 0 && (
                <div className="flex justify-between text-sm text-main">
                  <span>Transporte:</span>
                  <span>S/ {appointment.transportCost}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t border-[var(--color-border)] text-heading">
                <span>Total:</span>
                <span>S/ {appointment.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Notas */}
          {appointment.notes && (
            <div>
              <p className="text-sm text-muted mb-2">Notas</p>
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-sm text-main">{appointment.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-[var(--color-border)] space-y-2">
          {appointment.status === "PENDING" && (
            <button
              onClick={() => onUpdateStatus(appointment.id, "CONFIRMED")}
              disabled={isUpdating}
              className="w-full py-3 rounded-lg font-medium transition-colors border"
              style={{
                backgroundColor: "var(--status-confirmed-bg)",
                color: "var(--status-confirmed-text)",
                borderColor: "var(--status-confirmed-border)",
              }}
            >
              {isUpdating ? "Confirmando..." : "Confirmar"}
            </button>
          )}

          {(appointment.status === "PENDING" ||
            appointment.status === "CONFIRMED") && (
            <button
              onClick={() => onUpdateStatus(appointment.id, "COMPLETED")}
              disabled={isUpdating}
              className="w-full py-3 rounded-lg font-medium transition-colors border"
              style={{
                backgroundColor: "var(--status-completed-bg)",
                color: "var(--status-completed-text)",
                borderColor: "var(--status-completed-border)",
              }}
            >
              {isUpdating ? "Completando..." : "Completar"}
            </button>
          )}

          {appointment.status !== "CANCELLED" &&
            appointment.status !== "COMPLETED" && (
              <button
                onClick={() => onUpdateStatus(appointment.id, "CANCELLED")}
                disabled={isUpdating}
                className="w-full py-3 rounded-lg font-medium transition-colors border"
                style={{
                  backgroundColor: "var(--status-cancelled-bg)",
                  color: "var(--status-cancelled-text)",
                  borderColor: "var(--status-cancelled-border)",
                }}
              >
                {isUpdating ? "Cancelando..." : "Cancelar Cita"}
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<ProcessedAppointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<"grid" | "list">("list");

  const queryClient = useQueryClient();

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Query para obtener citas del mes
  const {
    data: appointments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["calendar-appointments", format(currentDate, "yyyy-MM")],
    queryFn: async () => {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const startDateStr = format(start, "yyyy-MM-dd");
      const endDateStr = format(end, "yyyy-MM-dd");

      const response = await fetch(
        `/api/admin/appointments/calendar?startDate=${startDateStr}&endDate=${endDateStr}`,
      );

      if (!response.ok) {
        throw new Error("Error al cargar las citas");
      }

      return response.json();
    },
    staleTime: 3 * 60 * 1000,
  });

  // Función para parsear fecha y hora
  const parseAppointmentDateTime = (dateStr: string, timeStr: string) => {
    try {
      const baseDate = parseISO(dateStr);
      if (!isValid(baseDate)) return null;

      const [startTime] = timeStr.split(" - ");
      const timePattern = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
      const match = startTime.match(timePattern);

      if (!match) return null;

      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();

      if (period === "AM" && hours === 12) {
        hours = 0;
      } else if (period === "PM" && hours !== 12) {
        hours += 12;
      }

      const finalDate = new Date(baseDate);
      finalDate.setHours(hours, minutes, 0, 0);

      return finalDate;
    } catch {
      return null;
    }
  };

  // Procesar citas
  const processedAppointments: ProcessedAppointment[] = useMemo(() => {
    return appointments
      .map((apt: CalendarAppointment) => {
        const startDate = parseAppointmentDateTime(apt.date, apt.time);
        if (!startDate) return null;

        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + apt.totalDuration);

        return {
          ...apt,
          startDate,
          endDate,
        };
      })
      .filter(
        (apt: ProcessedAppointment | null): apt is ProcessedAppointment =>
          apt !== null,
      );
  }, [appointments]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    
    const calendarStart = startOfWeek(start, { weekStartsOn: 0 }); // 0 = domingo
    const calendarEnd = endOfWeek(end, { weekStartsOn: 0 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, ProcessedAppointment[]>();

    processedAppointments.forEach((apt: ProcessedAppointment) => {
      const dayKey = format(apt.startDate, "yyyy-MM-dd");
      if (!map.has(dayKey)) {
        map.set(dayKey, []);
      }
      map.get(dayKey)!.push(apt);
    });

    // Ordenar citas por hora
    map.forEach((appointments) => {
      appointments.sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime(),
      );
    });

    return map;
  }, [processedAppointments]);

  // Mutación para actualizar estado
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la cita");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendar-appointments"] });
      setIsModalOpen(false);
      setSelectedAppointment(null);
    },
  });

  // Handlers
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleAppointmentClick = (appointment: ProcessedAppointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar el calendario</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)]"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        {/* Header */}
        <div className="bg-surface rounded-lg shadow-sm p-4 md:p-6 mb-6 border border-[var(--color-border)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-[var(--color-primary)]" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-heading">
                  Calendario de Citas
                </h1>
                <p className="text-sm md:text-base text-muted">
                  Vista mensual personalizada
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[var(--color-primary)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                {processedAppointments.length}{" "}
                {processedAppointments.length === 1 ? "cita" : "citas"}
              </div>
              <button
                onClick={handleToday}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors text-sm font-medium"
              >
                Hoy
              </button>
            </div>
          </div>
        </div>

        {/* Navegación del mes */}
        <div className="bg-surface rounded-lg shadow-sm p-4 md:p-6 mb-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-main" />
            </button>

            <h2 className="text-lg md:text-xl font-semibold text-heading">
              {format(currentDate, "MMMM 'de' yyyy", { locale: es })}
            </h2>

            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-surface-2 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-main" />
            </button>
          </div>
        </div>

        {/* Leyenda */}
        <div className="bg-surface rounded-lg shadow-sm p-4 mb-6 border border-[var(--color-border)]">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded border" style={{ background: "var(--status-pending-bg)", borderColor: "var(--status-pending-border)" }}></div>
              <span className="text-xs md:text-sm text-muted">Pendiente</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded border" style={{ background: "var(--status-confirmed-bg)", borderColor: "var(--status-confirmed-border)" }}></div>
              <span className="text-xs md:text-sm text-muted">Confirmada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded border" style={{ background: "var(--status-completed-bg)", borderColor: "var(--status-completed-border)" }}></div>
              <span className="text-xs md:text-sm text-muted">Completada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded border" style={{ background: "var(--status-cancelled-bg)", borderColor: "var(--status-cancelled-border)" }}></div>
              <span className="text-xs md:text-sm text-muted">Cancelada</span>
            </div>
          </div>
        </div>

        {/* Toggle para móvil */}
        {isMobile && (
          <div className="bg-surface rounded-lg shadow-sm p-4 mb-4 border border-[var(--color-border)]">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setMobileView("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  mobileView === "list"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-surface-2 text-main hover:opacity-90 border border-[var(--color-border)]"
                }`}
              >
                <List className="w-4 h-4" />
                Lista
              </button>
              <button
                onClick={() => setMobileView("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  mobileView === "grid"
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-surface-2 text-main hover:opacity-90 border border-[var(--color-border)]"
                }`}
              >
                <Grid className="w-4 h-4" />
                Grid
              </button>
            </div>
          </div>
        )}

        {/* Vista móvil en lista */}
        {isMobile && mobileView === "list" ? (
          <div className="space-y-4">
            {monthDays
              .filter((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const dayAppointments = appointmentsByDay.get(dayKey) || [];
                return (
                  dayAppointments.length > 0 && isSameMonth(day, currentDate)
                );
              })
              .map((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const dayAppointments = appointmentsByDay.get(dayKey) || [];
                const isTodayDate = isToday(day);

                return (
                  <div
                    key={dayKey}
                    className="bg-surface rounded-lg shadow-sm overflow-hidden border border-[var(--color-border)]"
                  >
                    {/* Cabecera del día */}
                    <div
                      className={`p-4 border-b border-[var(--color-border)] ${
                        isTodayDate
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-surface-2 text-heading"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {format(day, "EEEE d", { locale: es })}
                          </h3>
                          <p
                            className={`text-sm ${isTodayDate ? "text-white/80" : "text-muted"}`}
                          >
                            {format(day, "MMMM yyyy", { locale: es })}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isTodayDate
                              ? "bg-white/20 text-white"
                              : "bg-surface-2 text-main border border-[var(--color-border)]"
                          }`}
                        >
                          {dayAppointments.length}{" "}
                          {dayAppointments.length === 1 ? "cita" : "citas"}
                        </div>
                      </div>
                    </div>

                    {/* Citas del día */}
                    <div className="p-4 space-y-3">
                      {dayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          onClick={() => handleAppointmentClick(appointment)}
                          className="bg-surface-2 rounded-lg p-4 cursor-pointer transition-colors border border-[var(--color-border)] hover:opacity-95"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className="px-2 py-1 rounded-full text-xs font-medium border"
                                  style={{
                                    backgroundColor: `var(--status-${appointment.status.toLowerCase()}-bg)`,
                                    color: `var(--status-${appointment.status.toLowerCase()}-text)`,
                                    borderColor: `var(--status-${appointment.status.toLowerCase()}-border)`,
                                  }}
                                >
                                  {{
                                    PENDING: "Pendiente",
                                    CONFIRMED: "Confirmada",
                                    COMPLETED: "Completada",
                                    CANCELLED: "Cancelada",
                                  }[appointment.status]}
                                </span>
                              </div>
                              <h4 className="font-medium text-heading mb-1">
                                {appointment.clientName}
                              </h4>
                              <p className="text-sm text-main mb-2">
                                {appointment.time}
                              </p>
                              <p className="text-xs text-muted">
                                {appointment.service}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[var(--color-primary)]">
                                S/ {appointment.totalPrice}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

            {/* Mensaje si no hay citas */}
            {monthDays.filter((day) => {
              const dayKey = format(day, "yyyy-MM-dd");
              const dayAppointments = appointmentsByDay.get(dayKey) || [];
              return (
                dayAppointments.length > 0 && isSameMonth(day, currentDate)
              );
            }).length === 0 && (
              <div className="bg-surface rounded-lg shadow-sm p-8 text-center border border-[var(--color-border)]">
                <CalendarIcon className="w-12 h-12 text-[var(--color-border)] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-heading mb-2">
                  No hay citas este mes
                </h3>
                <p className="text-main">
                  Las citas aparecerán aquí cuando las tengas programadas.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Vista grid (desktop y móvil) */
          <div className="bg-surface rounded-lg shadow-sm overflow-hidden border border-[var(--color-border)]">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 bg-surface-2 border-b border-[var(--color-border)]">
              {(isMobile
                ? ["D", "L", "Ma", "Mi", "J", "V", "S"]
                : ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
              ).map((day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="p-2 md:p-4 text-center text-xs md:text-sm font-medium text-main"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7">
              {monthDays.map((day) => {
                const dayKey = format(day, "yyyy-MM-dd");
                const dayAppointments = appointmentsByDay.get(dayKey) || [];
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDate = isToday(day);

                return (
                  <div
                    key={dayKey}
                    className={`${
                      isMobile ? "min-h-16" : "min-h-24 md:min-h-32"
                    } p-1 md:p-2 border-b border-r border-[var(--color-border)] ${
                      !isCurrentMonth ? "bg-surface-2" : "bg-surface"
                    }`}
                  >
                    {/* Número del día */}
                    <div
                      className={`${
                        isMobile ? "text-xs" : "text-sm md:text-base"
                      } font-medium mb-1 md:mb-2 ${
                        isTodayDate
                          ? `bg-[var(--color-primary)] text-white ${
                              isMobile ? "w-5 h-5" : "w-6 h-6 md:w-8 md:h-8"
                            } rounded-full flex items-center justify-center text-xs md:text-sm`
                          : !isCurrentMonth
                            ? "text-muted"
                            : "text-heading"
                      }`}
                    >
                      {format(day, "d")}
                    </div>

                    {/* Citas del día */}
                    <div className="space-y-1">
                      {dayAppointments
                        .slice(0, isMobile ? 1 : 3)
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            onClick={() => handleAppointmentClick(appointment)}
                            className={`rounded p-1 cursor-pointer border transition-all hover:scale-105 ${
                              isMobile ? "text-xs" : "text-xs"
                            }`}
                            style={{
                              backgroundColor: `var(--status-${appointment.status.toLowerCase()}-bg)`,
                              color: `var(--status-${appointment.status.toLowerCase()}-text)`,
                              borderColor: `var(--status-${appointment.status.toLowerCase()}-border)`,
                              opacity: appointment.status === "CANCELLED" ? 0.85 : 1,
                            }}
                          >
                            <div className="font-medium truncate">
                              {isMobile
                                ? appointment.clientName.split(" ")[0]
                                : appointment.clientName}
                            </div>
                            {!isMobile && (
                              <>
                                <div className="text-xs opacity-90 mt-1">
                                  {appointment.time.split(" - ")[0]}
                                </div>
                                <div className="text-xs opacity-90">
                                  S/ {appointment.totalPrice}
                                </div>
                              </>
                            )}
                          </div>
                        ))}

                      {/* Mostrar "+ más" si hay más citas */}
                      {dayAppointments.length > (isMobile ? 1 : 3) && (
                        <div className="text-xs text-muted bg-surface-2 border border-[var(--color-border)] rounded p-1 text-center cursor-pointer hover:opacity-90">
                          +{dayAppointments.length - (isMobile ? 1 : 3)} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={updateStatusMutation.isPending}
      />
    </div>
  );
}
