import { type RecentAppointment } from '@/hooks/useRecentAppointments';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTime = (timeString: string): string => {
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateTime = (dateString: string, timeString: string): string => {
  return `${formatDate(dateString)} • ${formatTime(timeString)}`;
};

export const getStatusColor = (status: RecentAppointment['status']): string => {
  const statusColors = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  };
  
  return statusColors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export const getStatusText = (status: RecentAppointment['status']): string => {
  const statusTexts = {
    PENDING: 'Pendiente',
    CONFIRMED: 'Confirmada',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
  };
  
  return statusTexts[status] || status;
};

export const getClientInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
