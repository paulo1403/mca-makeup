import { format, toZonedTime, fromZonedTime } from "date-fns-tz";
import { parseISO, isValid } from "date-fns";
import { es } from "date-fns/locale";

// Zona horaria de Perú - usar variable personalizada para Vercel
export const PERU_TIMEZONE = process.env.APP_TIMEZONE || "America/Lima";

/**
 * Convierte una fecha UTC a la zona horaria de Perú
 */
export function toPeruTime(date: Date): Date {
  return toZonedTime(date, PERU_TIMEZONE);
}

/**
 * Convierte una fecha de Perú a UTC para almacenar en la base de datos
 */
export function fromPeruTime(date: Date): Date {
  return fromZonedTime(date, PERU_TIMEZONE);
}

/**
 * Formatea una fecha en español para mostrar al usuario
 */
export function formatDateForDisplay(date: Date): string {
  const peruDate = toPeruTime(date);
  return format(peruDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
}

/**
 * Formatea una fecha para el calendario (YYYY-MM-DD) en zona horaria de Perú
 */
export function formatDateForCalendar(date: Date): string {
  const peruDate = toPeruTime(date);
  return format(peruDate, "yyyy-MM-dd");
}

/**
 * Parsea una fecha string (YYYY-MM-DD) como fecha local de Perú
 */
export function parseDateFromString(dateString: string): Date {
  // Si el formato es YYYY-MM-DD, parsear como fecha local de Perú
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split("-").map(Number);
    // Crear fecha en zona horaria de Perú (no UTC)
    const localDate = new Date(year, month - 1, day, 12, 0, 0, 0); // Usar mediodía para evitar problemas de DST
    return fromPeruTime(localDate);
  }

  // Para otros formatos, usar parseISO
  const parsed = parseISO(dateString);
  if (isValid(parsed)) {
    return parsed;
  }

  throw new Error(`Invalid date format: ${dateString}`);
}

/**
 * Obtiene la fecha actual en zona horaria de Perú
 */
export function getCurrentPeruDate(): Date {
  return toPeruTime(new Date());
}

/**
 * Obtiene solo la fecha (sin hora) en zona horaria de Perú
 */
export function getPeruDateOnly(date: Date = new Date()): Date {
  const peruDate = toPeruTime(date);
  const year = peruDate.getFullYear();
  const month = peruDate.getMonth();
  const day = peruDate.getDate();

  // Crear nueva fecha en Perú a medianoche
  const dateOnly = new Date(year, month, day, 0, 0, 0, 0);
  return fromPeruTime(dateOnly);
}

/**
 * Convierte un rango de tiempo (ej: "09:00 - 10:00") a formato de 12 horas
 */
export function formatTimeRange(timeRange: string): string {
  if (!timeRange.includes(" - ")) {
    return timeRange;
  }

  const [startTime, endTime] = timeRange.split(" - ");

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return format(date, "h:mm a", { locale: es });
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Valida si una fecha está en el futuro (considerando zona horaria de Perú)
 */
export function isDateInFuture(date: Date): boolean {
  const now = getCurrentPeruDate();
  const targetDate = toPeruTime(date);

  // Comparar solo las fechas (sin hora)
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDateOnly = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );

  return targetDateOnly >= nowDate;
}

/**
 * Obtiene el inicio del día en zona horaria de Perú
 */
export function getStartOfDayInPeru(date: Date): Date {
  const peruDate = toPeruTime(date);
  const startOfDay = new Date(
    peruDate.getFullYear(),
    peruDate.getMonth(),
    peruDate.getDate(),
    0,
    0,
    0,
    0,
  );
  return fromPeruTime(startOfDay);
}

/**
 * Obtiene el final del día en zona horaria de Perú
 */
export function getEndOfDayInPeru(date: Date): Date {
  const peruDate = toPeruTime(date);
  const endOfDay = new Date(
    peruDate.getFullYear(),
    peruDate.getMonth(),
    peruDate.getDate(),
    23,
    59,
    59,
    999,
  );
  return fromPeruTime(endOfDay);
}

/**
 * Convierte una fecha de base de datos para mostrar en el admin panel
 */
export function formatDateTimeForAdmin(date: Date): string {
  const peruDate = toPeruTime(date);
  return format(peruDate, "dd/MM/yyyy HH:mm", { locale: es });
}

/**
 * Debug: Muestra información de una fecha en diferentes zonas horarias
 */
export function debugDate(date: Date, label: string = "Date"): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`🕐 ${label}:`);
    console.log(`  UTC: ${date.toISOString()}`);
    console.log(
      `  Peru: ${format(toPeruTime(date), "yyyy-MM-dd HH:mm:ss zzz", { locale: es })}`,
    );
    console.log(`  Local: ${date.toLocaleString()}`);
  }
}
