"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar as CalendarIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar.css";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

import { CalendarEvent, mapAppointmentsToEvents } from "@/utils/calendarEvents";
import { AppointmentModal } from "@/components/AppointmentModal";
import { getEventStyleGetter } from "@/utils/calendarEventStyle";
import {
  EventComponent,
  AgendaEventComponent,
} from "@/components/CalendarEventComponents";
import { NotificationToast } from "@/components/NotificationToast";

export default function AdminCalendar() {
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const queryClient = useQueryClient();

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000); // Aumenté el tiempo para que sea menos molesto
  };

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // En móviles, usar vista de agenda por defecto
      if (window.innerWidth < 768 && currentView === Views.MONTH) {
        setCurrentView(Views.AGENDA);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [currentView]);

  // Obtener rango de fechas del calendario
  const getCalendarDateRange = useCallback(() => {
    const startOfMonth = new Date(currentDate);
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(currentDate);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Para vista de semana o día, usar un rango más pequeño
    if (currentView === Views.WEEK) {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day;
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return { start: startOfWeek, end: endOfWeek };
    } else if (currentView === Views.DAY) {
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);

      return { start: startOfDay, end: endOfDay };
    }

    return { start: startOfMonth, end: endOfMonth };
  }, [currentDate, currentView]);

  // Obtener citas optimizadas por rango de fechas
  const {
    data: appointmentsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["calendar-appointments", currentDate, currentView],
    queryFn: async () => {
      const { start, end } = getCalendarDateRange();

      // Formatear fechas para la API
      const startDateStr = start.toISOString().split("T")[0];
      const endDateStr = end.toISOString().split("T")[0];

      // Usar la API de calendario optimizada con filtros de fecha
      const response = await fetch(
        `/api/admin/appointments/calendar?startDate=${startDateStr}&endDate=${endDateStr}`,
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cargar las citas");
      }
      const appointments = await response.json();
      return appointments;
    },
    retry: 2,
    staleTime: 3 * 60 * 1000, // 3 minutos para calendarios optimizados
  });

  // Convertir citas a eventos del calendario
  const events: CalendarEvent[] = useMemo(() => {
    const appointments = appointmentsResponse || [];
    // Mapear desde el formato de la API de calendario
    const formattedAppointments = appointments.map(
      (apt: {
        id: string;
        clientName: string;
        clientEmail: string;
        clientPhone: string;
        date: string;
        time: string;
        service: string;
        status: string;
        notes: string;
        price: number;
      }) => ({
        id: apt.id,
        clientName: apt.clientName,
        clientEmail: apt.clientEmail,
        clientPhone: apt.clientPhone,
        serviceType: apt.service,
        appointmentDate: apt.date,
        appointmentTime: apt.time,
        status: apt.status,
        additionalNotes: apt.notes,
        totalPrice: apt.price,
        servicePrice: apt.price,
        duration: 120, // Default duration
      }),
    );
    return mapAppointmentsToEvents(formattedAppointments);
  }, [appointmentsResponse]);

  // Mutación para actualizar estado de cita
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/admin/appointments`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar la cita");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setIsModalOpen(false);
      setSelectedEvent(null);
      showNotification(
        "Estado de la cita actualizado correctamente",
        "success",
      );
    },
    onError: (error) => {
      showNotification(error.message || "Error al actualizar la cita", "error");
    },
  });

  // Manejar selección de evento
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  // Manejar actualización de estado
  const handleUpdateStatus = useCallback(
    (id: string, status: string) => {
      updateStatusMutation.mutate({ id, status });
    },
    [updateStatusMutation],
  );

  // Personalización de colores según estado (más sutiles para agenda)
  const eventStyleGetter = getEventStyleGetter(currentView);

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
            className="px-4 py-2 bg-[#D4AF37] text-white rounded hover:bg-[#B8941F] transition-colors"
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
                  Gestiona todas tus citas desde aquí
                </p>
              </div>
            </div>

            {/* Leyenda de estados */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs md:text-sm text-gray-600">
                  Pendiente
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs md:text-sm text-gray-600">
                  Confirmada
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs md:text-sm text-gray-600">
                  Completada
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs md:text-sm text-gray-600">
                  Cancelada
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendario */}
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
          <div
            style={{
              height: isMobile ? "calc(100vh - 250px)" : "calc(100vh - 300px)",
              minHeight: isMobile ? "400px" : "600px",
            }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              onSelectEvent={handleSelectEvent}
              onView={setCurrentView}
              onNavigate={setCurrentDate}
              view={currentView}
              date={currentDate}
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent,
                agenda: {
                  event: ({ event }: { event: CalendarEvent }) => (
                    <div
                      onClick={() => handleSelectEvent(event)}
                      className="cursor-pointer"
                    >
                      <AgendaEventComponent event={event} />
                    </div>
                  ),
                },
              }}
              popup={isMobile}
              popupOffset={30}
              views={
                isMobile
                  ? [Views.AGENDA, Views.DAY]
                  : [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]
              }
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Lista",
                date: "Fecha",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "No hay citas en este rango de fechas",
                showMore: (total) => `+ Ver ${total} más`,
                work_week: "Semana Laboral",
              }}
              formats={{
                dateFormat: "d",
                dayFormat: (date, culture, localizer) =>
                  localizer?.format(date, isMobile ? "EEE" : "EEEE", culture) ||
                  "",
                dayHeaderFormat: (date, culture, localizer) =>
                  localizer?.format(
                    date,
                    isMobile ? "EEE d/M" : "EEEE d/M",
                    culture,
                  ) || "",
                monthHeaderFormat: (date, culture, localizer) =>
                  localizer?.format(date, "MMMM yyyy", culture) || "",
                agendaHeaderFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, "d MMMM", culture)} - ${localizer?.format(end, "d MMMM yyyy", culture)}`,
                agendaDateFormat: (date, culture, localizer) =>
                  localizer?.format(
                    date,
                    isMobile ? "EEE d MMM" : "EEEE d MMMM",
                    culture,
                  ) || "",
                agendaTimeFormat: (date, culture, localizer) =>
                  localizer?.format(date, "HH:mm", culture) || "",
                agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, "HH:mm", culture)} - ${localizer?.format(end, "HH:mm", culture)}`,
                timeGutterFormat: (date, culture, localizer) =>
                  localizer?.format(date, "HH:mm", culture) || "",
                dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, "d MMM", culture)} - ${localizer?.format(end, "d MMM yyyy", culture)}`,
                weekdayFormat: (date, culture, localizer) =>
                  localizer?.format(date, "EEE", culture) || "",
                eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, "HH:mm", culture)} - ${localizer?.format(end, "HH:mm", culture)}`,
                selectRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, "HH:mm", culture)} - ${localizer?.format(end, "HH:mm", culture)}`,
              }}
              culture="es"
              step={30}
              timeslots={2}
              min={new Date(2025, 1, 1, 8, 0, 0)}
              max={new Date(2025, 1, 1, 20, 0, 0)}
              scrollToTime={new Date(2025, 1, 1, 9, 0, 0)}
              showMultiDayTimes={true}
              dayLayoutAlgorithm="no-overlap"
              toolbar={true}
              showAllEvents={true}
              doShowMoreDrillDown={false}
              length={7}
            />
          </div>
        </div>

        {/* Modal de detalles */}
        <AppointmentModal
          appointment={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
          }}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={updateStatusMutation.isPending}
        />

        <NotificationToast
          notification={notification}
          onClose={() => setNotification(null)}
        />

        <style jsx>{`
          @keyframes shrinkWidth {
            from {
              width: 100%;
            }
            to {
              width: 0%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
