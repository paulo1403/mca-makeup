// utils/dateRange.ts

/**
 * Convierte un string de rango de hora ("09:00 - 11:30") a objetos Date de inicio y fin.
 * Si solo se recibe una hora, usa la duración (en minutos) para calcular el fin.
 */
export function parseAppointmentTime(
  appointmentDate: string,
  appointmentTime: string,
  duration?: number
): { start: Date; end: Date } {
  const date = new Date(appointmentDate);
  let start: Date, end: Date;
  if (appointmentTime.includes(' - ')) {
    const [startStr, endStr] = appointmentTime.split(' - ');
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    start = new Date(date);
    start.setHours(startH, startM, 0, 0);
    end = new Date(date);
    end.setHours(endH, endM, 0, 0);
  } else {
    const [hours, minutes] = appointmentTime.split(':').map(Number);
    start = new Date(date);
    start.setHours(hours, minutes, 0, 0);
    end = new Date(start);
    const durationMinutes = duration || 120;
    end.setTime(start.getTime() + (durationMinutes * 60 * 1000));
  }
  return { start, end };
}
