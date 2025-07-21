'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar as CalendarIcon, Clock, User, Phone, MapPin } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';

// Configuración del localizador con date-fns
const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Tipos para los eventos del calendario
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    id: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    service: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
    price: number;
  };
}

// Componente para mostrar detalles del evento
const EventComponent = ({ event }: { event: CalendarEvent }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'CONFIRMED': return '✅';
      case 'COMPLETED': return '✨';
      case 'CANCELLED': return '❌';
      default: return '📅';
    }
  };

  return (
    <div className={`p-1 text-xs rounded border ${getStatusColor(event.resource.status)} hover:shadow-sm transition-shadow`}>
      <div className="flex items-center gap-1">
        <span className="text-xs">{getStatusIcon(event.resource.status)}</span>
        <div className="font-medium truncate flex-1">{event.resource.clientName}</div>
      </div>
      <div className="truncate text-[10px] md:text-xs opacity-90">{event.resource.service}</div>
      {event.resource.price > 0 && (
        <div className="text-[9px] md:text-[10px] font-semibold opacity-75">
          S/ {event.resource.price}
        </div>
      )}
    </div>
  );
};

// Componente específico para eventos en vista de agenda (más elegante)
const AgendaEventComponent = ({ event }: { event: CalendarEvent }) => {
  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { 
        dot: 'bg-amber-400', 
        bg: 'bg-amber-50', 
        border: 'border-amber-200',
        text: 'text-amber-700'
      },
      CONFIRMED: { 
        dot: 'bg-emerald-400', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-200',
        text: 'text-emerald-700'
      },
      COMPLETED: { 
        dot: 'bg-blue-400', 
        bg: 'bg-blue-50', 
        border: 'border-blue-200',
        text: 'text-blue-700'
      },
      CANCELLED: { 
        dot: 'bg-rose-400', 
        bg: 'bg-rose-50', 
        border: 'border-rose-200',
        text: 'text-rose-700'
      }
    };
    return configs[status as keyof typeof configs] || {
      dot: 'bg-gray-400', 
      bg: 'bg-gray-50', 
      border: 'border-gray-200',
      text: 'text-gray-700'
    };
  };

  const config = getStatusConfig(event.resource.status);

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${config.bg} ${config.border} hover:shadow-sm`}>
      {/* Indicador de estado */}
      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dot}`}></div>
      
      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {event.resource.clientName}
            </p>
            <p className="text-xs text-gray-600 truncate mt-0.5">
              {event.resource.service}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0 text-right">
            <p className="text-sm font-semibold text-gray-900">
              S/ {event.resource.price}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal para mostrar detalles de la cita
const AppointmentModal = ({ 
  appointment, 
  isOpen, 
  onClose, 
  onUpdateStatus,
  isUpdating = false
}: { 
  appointment: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  isUpdating?: boolean;
}) => {
  if (!isOpen || !appointment) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      CONFIRMED: { label: 'Confirmada', className: 'bg-green-100 text-green-800' },
      COMPLETED: { label: 'Completada', className: 'bg-blue-100 text-blue-800' },
      CANCELLED: { label: 'Cancelada', className: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Detalles de la Cita</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl md:text-base"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Cliente */}
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{appointment.resource.clientName}</p>
                <p className="text-sm text-gray-600">{appointment.resource.clientEmail}</p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <p className="text-gray-900">{appointment.resource.clientPhone}</p>
            </div>

            {/* Fecha y Hora */}
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900">
                  {format(appointment.start, 'EEEE, d MMMM yyyy', { locale: es })}
                </p>
                <p className="text-sm text-gray-600">
                  {format(appointment.start, 'HH:mm')} - {format(appointment.end, 'HH:mm')}
                </p>
              </div>
            </div>

            {/* Servicio */}
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-900">{appointment.resource.service}</p>
                <p className="text-sm font-medium text-[#D4AF37]">S/ {appointment.resource.price}</p>
              </div>
            </div>

            {/* Estado */}
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              </div>
              <div>
                {getStatusBadge(appointment.resource.status)}
              </div>
            </div>

            {/* Notas */}
            {appointment.resource.notes && (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Notas:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{appointment.resource.notes}</p>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-6 pt-4 border-t">
            {appointment.resource.status === 'PENDING' && (
              <button
                onClick={() => onUpdateStatus(appointment.resource.id, 'CONFIRMED')}
                disabled={isUpdating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm w-full sm:w-auto flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Confirmando...
                  </>
                ) : (
                  'Confirmar'
                )}
              </button>
            )}
            {(appointment.resource.status === 'PENDING' || appointment.resource.status === 'CONFIRMED') && (
              <button
                onClick={() => onUpdateStatus(appointment.resource.id, 'COMPLETED')}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm w-full sm:w-auto flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  'Marcar Completada'
                )}
              </button>
            )}
            {appointment.resource.status !== 'CANCELLED' && appointment.resource.status !== 'COMPLETED' && (
              <button
                onClick={() => onUpdateStatus(appointment.resource.id, 'CANCELLED')}
                disabled={isUpdating}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm w-full sm:w-auto flex items-center justify-center"
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cancelando...
                  </>
                ) : (
                  'Cancelar'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminCalendar() {
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const queryClient = useQueryClient();

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: 'success' | 'error') => {
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
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [currentView]);

  // Obtener citas
  const { data: appointmentsResponse, isLoading, error } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await fetch('/api/admin/appointments?limit=1000');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar las citas');
      }
      const result = await response.json();
      return result.data?.appointments || [];
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Convertir citas a eventos del calendario
  const events: CalendarEvent[] = useMemo(() => {
    const appointments = appointmentsResponse || [];
    return appointments.map((appointment: { 
      id: string; 
      clientName: string; 
      clientEmail: string; 
      clientPhone: string; 
      appointmentDate: string; 
      appointmentTime: string; 
      serviceType: string; 
      status: string; 
      additionalNotes?: string;
      price?: number;
      duration?: number;
    }) => {
      try {
        const appointmentDate = new Date(appointment.appointmentDate);
        const [hours, minutes] = appointment.appointmentTime.split(':').map(Number);
        
        // Validar que la fecha y hora sean válidas
        if (isNaN(appointmentDate.getTime()) || isNaN(hours) || isNaN(minutes)) {
          console.warn(`Invalid date/time for appointment ${appointment.id}`);
          return null;
        }
        
        const start = new Date(appointmentDate);
        start.setHours(hours, minutes, 0, 0);
        
        const end = new Date(start);
        // Usar duración del appointment o default 2 horas
        const durationMinutes = appointment.duration || 120;
        end.setTime(start.getTime() + (durationMinutes * 60 * 1000));

        return {
          id: appointment.id,
          title: `${appointment.clientName} - ${appointment.serviceType}`,
          start,
          end,
          resource: {
            id: appointment.id,
            clientName: appointment.clientName,
            clientEmail: appointment.clientEmail,
            clientPhone: appointment.clientPhone,
            service: appointment.serviceType,
            status: appointment.status as 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED',
            notes: appointment.additionalNotes,
            price: appointment.price || 0,
          },
        };
      } catch (error) {
        console.error(`Error processing appointment ${appointment.id}:`, error);
        return null;
      }
    }).filter(Boolean) as CalendarEvent[];
  }, [appointmentsResponse]);

  // Mutación para actualizar estado de cita
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/admin/appointments`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la cita');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsModalOpen(false);
      setSelectedEvent(null);
      showNotification('Estado de la cita actualizado correctamente', 'success');
    },
    onError: (error) => {
      showNotification(error.message || 'Error al actualizar la cita', 'error');
    },
  });

  // Manejar selección de evento
  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  // Manejar actualización de estado
  const handleUpdateStatus = useCallback((id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  }, [updateStatusMutation]);

  // Personalización de colores según estado (más sutiles para agenda)
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#D4AF37'; // Color dorado por defecto
    let borderColor = '#D4AF37';
    
    // En vista de agenda, usar colores más sutiles
    if (currentView === Views.AGENDA) {
      switch (event.resource.status) {
        case 'PENDING':
          backgroundColor = '#FEF3C7'; // Amarillo muy suave
          borderColor = '#F59E0B';
          break;
        case 'CONFIRMED':
          backgroundColor = '#D1FAE5'; // Verde muy suave
          borderColor = '#10B981';
          break;
        case 'COMPLETED':
          backgroundColor = '#DBEAFE'; // Azul muy suave
          borderColor = '#3B82F6';
          break;
        case 'CANCELLED':
          backgroundColor = '#FEE2E2'; // Rojo muy suave
          borderColor = '#EF4444';
          break;
      }
      
      return {
        style: {
          backgroundColor,
          borderLeft: `4px solid ${borderColor}`,
          borderRadius: '8px',
          opacity: 1,
          color: '#374151', // Texto gris oscuro
          border: `1px solid ${borderColor}20`, // Borde muy sutil
          display: 'block',
          padding: '8px 12px',
          margin: '2px 0',
        },
      };
    }
    
    // Para otras vistas, mantener colores originales
    switch (event.resource.status) {
      case 'PENDING':
        backgroundColor = '#F59E0B'; // Amarillo
        break;
      case 'CONFIRMED':
        backgroundColor = '#10B981'; // Verde
        break;
      case 'COMPLETED':
        backgroundColor = '#3B82F6'; // Azul
        break;
      case 'CANCELLED':
        backgroundColor = '#EF4444'; // Rojo
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
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
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Calendario de Citas</h1>
                <p className="text-sm md:text-base text-gray-600">Gestiona todas tus citas desde aquí</p>
              </div>
            </div>
            
        {/* Leyenda de estados */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-xs md:text-sm text-gray-600">Pendiente</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-xs md:text-sm text-gray-600">Confirmada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs md:text-sm text-gray-600">Completada</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-xs md:text-sm text-gray-600">Cancelada</span>
          </div>
        </div>
          </div>
        </div>

        {/* Calendario */}
        <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
          <div style={{ 
            height: isMobile ? 'calc(100vh - 250px)' : 'calc(100vh - 300px)', 
            minHeight: isMobile ? '400px' : '600px' 
          }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
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
                    <div onClick={() => handleSelectEvent(event)} className="cursor-pointer">
                      <AgendaEventComponent event={event} />
                    </div>
                  ),
                },
              }}
              popup={isMobile}
              popupOffset={30}
              views={isMobile ? [Views.AGENDA, Views.DAY] : [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              messages={{
                next: 'Siguiente',
                previous: 'Anterior',
                today: 'Hoy',
                month: 'Mes',
                week: 'Semana',
                day: 'Día',
                agenda: 'Lista',
                date: 'Fecha',
                time: 'Hora',
                event: 'Evento',
                noEventsInRange: 'No hay citas en este rango de fechas',
                showMore: (total) => `+ Ver ${total} más`,
              }}
              formats={{
                dateFormat: 'd',
                dayFormat: (date, culture, localizer) =>
                  localizer?.format(date, isMobile ? 'EEE' : 'EEEE', culture) || '',
                dayHeaderFormat: (date, culture, localizer) =>
                  localizer?.format(date, isMobile ? 'EEE d/M' : 'EEEE d/M', culture) || '',
                monthHeaderFormat: (date, culture, localizer) =>
                  localizer?.format(date, 'MMMM yyyy', culture) || '',
                agendaHeaderFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, 'd MMMM', culture)} - ${localizer?.format(end, 'd MMMM yyyy', culture)}`,
                agendaDateFormat: (date, culture, localizer) =>
                  localizer?.format(date, isMobile ? 'EEE d MMM' : 'EEEE d MMMM', culture) || '',
                agendaTimeFormat: (date, culture, localizer) =>
                  localizer?.format(date, 'HH:mm', culture) || '',
                agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, 'HH:mm', culture)} - ${localizer?.format(end, 'HH:mm', culture)}`,
                timeGutterFormat: (date, culture, localizer) =>
                  localizer?.format(date, 'HH:mm', culture) || '',
                dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, 'd MMM', culture)} - ${localizer?.format(end, 'd MMM yyyy', culture)}`,
                weekdayFormat: (date, culture, localizer) =>
                  localizer?.format(date, 'EEE', culture) || '',
                eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, 'HH:mm', culture)} - ${localizer?.format(end, 'HH:mm', culture)}`,
                selectRangeFormat: ({ start, end }, culture, localizer) =>
                  `${localizer?.format(start, 'HH:mm', culture)} - ${localizer?.format(end, 'HH:mm', culture)}`,
              }}
              culture="es"
              step={30}
              timeslots={2}
              min={new Date(2025, 1, 1, 8, 0, 0)}
              max={new Date(2025, 1, 1, 20, 0, 0)}
              scrollToTime={new Date(2025, 1, 1, 8, 0, 0)}
              showMultiDayTimes={true}
              dayLayoutAlgorithm="no-overlap"
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

        {/* Notificación Toast sutil */}
        {notification && (
          <div className={`fixed bottom-4 right-4 z-50 transform transition-all duration-500 ease-in-out max-w-sm ${
            notification ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <div className={`backdrop-blur-sm shadow-lg rounded-lg border border-gray-200 overflow-hidden ${
              notification.type === 'success' 
                ? 'bg-white/90' 
                : 'bg-white/90'
            }`}>
              <div className="p-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <p className="text-sm font-medium text-gray-900 flex-1">
                    {notification.message}
                  </p>
                  <button
                    onClick={() => setNotification(null)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
              {/* Barra de progreso minimalista */}
              <div className={`h-0.5 ${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } transition-all duration-4000 ease-linear`}
              style={{
                width: '100%',
                animation: 'shrinkWidth 4s linear forwards'
              }}/>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes shrinkWidth {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}
