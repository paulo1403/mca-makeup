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
    const configs = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Pendiente",
      },
      CONFIRMED: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Confirmada",
      },
      COMPLETED: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Completada",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Cancelada",
      },
    };
    return configs[status as keyof typeof configs] || configs.PENDING;
  };

  const statusInfo = getStatusInfo(appointment.status);
  const hasMultipleServices =
    appointment.services && appointment.services.length > 1;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header minimalista */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {appointment.clientName}
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color} mt-2`}
              >
                {statusInfo.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content limpio */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
          {/* Información básica */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Fecha y hora</p>
              <p className="font-medium text-gray-900">
                {format(appointment.startDate, "EEEE, d 'de' MMMM", {
                  locale: es,
                })}
              </p>
              <p className="text-sm text-gray-600">{appointment.time}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Contacto</p>
              <p className="text-gray-900">{appointment.clientEmail}</p>
              <p className="text-gray-900">{appointment.clientPhone}</p>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <p className="text-sm text-gray-500 mb-2">
              {hasMultipleServices ? "Servicios" : "Servicio"}
            </p>
            <div className="bg-gray-50 rounded-lg p-3">
              {hasMultipleServices ? (
                <div className="space-y-2">
                  {appointment.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {service.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {service.category}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        S/ {service.price}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-medium text-gray-900">
                  {appointment.service}
                </p>
              )}
            </div>
          </div>

          {/* Precios */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Desglose de precios</p>
            <div className="bg-amber-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Servicios:</span>
                <span>S/ {appointment.servicePrice}</span>
              </div>
              {appointment.transportCost > 0 && (
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Transporte:</span>
                  <span>S/ {appointment.transportCost}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t border-amber-200 text-amber-800">
                <span>Total:</span>
                <span>S/ {appointment.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Notas */}
          {appointment.notes && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Notas</p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{appointment.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions minimalistas */}
        <div className="p-6 border-t border-gray-100 space-y-2">
          {appointment.status === "PENDING" && (
            <button
              onClick={() => onUpdateStatus(appointment.id, "CONFIRMED")}
              disabled={isUpdating}
              className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Confirmando..." : "Confirmar"}
            </button>
          )}

          {(appointment.status === "PENDING" ||
            appointment.status === "CONFIRMED") && (
            <button
              onClick={() => onUpdateStatus(appointment.id, "COMPLETED")}
              disabled={isUpdating}
              className="w-full py-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Completando..." : "Completar"}
            </button>
          )}

          {appointment.status !== "CANCELLED" &&
            appointment.status !== "COMPLETED" && (
              <button
                onClick={() => onUpdateStatus(appointment.id, "CANCELLED")}
                disabled={isUpdating}
                className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg font-medium transition-colors disabled:opacity-50"
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

  // Obtener días del mes
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // Obtener citas por día
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
            className="px-4 py-2 bg-[#D4AF37] text-white rounded hover:bg-[#B8941F]"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-[#D4AF37]" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  Calendario de Citas
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  Vista mensual personalizada
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-sm font-semibold">
                {processedAppointments.length}{" "}
                {processedAppointments.length === 1 ? "cita" : "citas"}
              </div>
              <button
                onClick={handleToday}
                className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors text-sm font-medium"
              >
                Hoy
              </button>
            </div>
          </div>
        </div>

        {/* Navegación del mes */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {format(currentDate, "MMMM 'de' yyyy", { locale: es })}
            </h2>

            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Leyenda */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-200 rounded border border-yellow-300"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Pendiente
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 rounded border border-blue-300"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Confirmada
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-200 rounded border border-green-300"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Completada
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-200 rounded border border-red-300"></div>
              <span className="text-xs md:text-sm text-gray-600">
                Cancelada
              </span>
            </div>
          </div>
        </div>

        {/* Toggle para móvil */}
        {isMobile && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setMobileView("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  mobileView === "list"
                    ? "bg-[#D4AF37] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List className="w-4 h-4" />
                Lista
              </button>
              <button
                onClick={() => setMobileView("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  mobileView === "grid"
                    ? "bg-[#D4AF37] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {/* Cabecera del día */}
                    <div
                      className={`p-4 border-b ${
                        isTodayDate
                          ? "bg-[#D4AF37] text-white"
                          : "bg-gray-50 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {format(day, "EEEE d", { locale: es })}
                          </h3>
                          <p
                            className={`text-sm ${isTodayDate ? "text-white/80" : "text-gray-600"}`}
                          >
                            {format(day, "MMMM yyyy", { locale: es })}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isTodayDate
                              ? "bg-white/20 text-white"
                              : "bg-gray-200 text-gray-700"
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
                          className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    {
                                      PENDING: "bg-yellow-100 text-yellow-800",
                                      CONFIRMED: "bg-blue-100 text-blue-800",
                                      COMPLETED: "bg-green-100 text-green-800",
                                      CANCELLED: "bg-red-100 text-red-800",
                                    }[appointment.status]
                                  }`}
                                >
                                  {
                                    {
                                      PENDING: "Pendiente",
                                      CONFIRMED: "Confirmada",
                                      COMPLETED: "Completada",
                                      CANCELLED: "Cancelada",
                                    }[appointment.status]
                                  }
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                {appointment.clientName}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {appointment.time}
                              </p>
                              <p className="text-xs text-gray-500">
                                {appointment.service}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[#D4AF37]">
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
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay citas este mes
                </h3>
                <p className="text-gray-600">
                  Las citas aparecerán aquí cuando las tengas programadas.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Vista grid (desktop y móvil) */
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {(isMobile
                ? ["D", "L", "Ma", "Mi", "J", "V", "S"]
                : ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
              ).map((day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="p-2 md:p-4 text-center text-xs md:text-sm font-medium text-gray-700"
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
                    } p-1 md:p-2 border-b border-r border-gray-200 ${
                      !isCurrentMonth ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    {/* Número del día */}
                    <div
                      className={`${
                        isMobile ? "text-xs" : "text-sm md:text-base"
                      } font-medium mb-1 md:mb-2 ${
                        isTodayDate
                          ? `bg-[#D4AF37] text-white ${
                              isMobile ? "w-5 h-5" : "w-6 h-6 md:w-8 md:h-8"
                            } rounded-full flex items-center justify-center text-xs md:text-sm`
                          : !isCurrentMonth
                            ? "text-gray-400"
                            : "text-gray-900"
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
                            className={`${
                              {
                                PENDING:
                                  "bg-yellow-100 border-yellow-200 text-yellow-800",
                                CONFIRMED:
                                  "bg-blue-100 border-blue-200 text-blue-800",
                                COMPLETED:
                                  "bg-green-100 border-green-200 text-green-800",
                                CANCELLED:
                                  "bg-red-100 border-red-200 text-red-800 opacity-75",
                              }[appointment.status]
                            } rounded p-1 cursor-pointer border transition-all hover:scale-105 hover:shadow-lg hover:border-opacity-60 ${
                              isMobile ? "text-xs" : "text-xs"
                            }`}
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
                        <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-1 text-center cursor-pointer hover:bg-gray-100 transition-colors">
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
