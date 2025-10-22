import { isValid, parseISO } from "date-fns";
import { format, fromZonedTime, toZonedTime } from "date-fns-tz";
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
 * Formatea una fecha en formato corto para el dashboard (ej: "2 ago 2025")
 */
export function formatDateForDashboard(date: Date): string {
  const peruDate = toPeruTime(date);
  return format(peruDate, "d MMM yyyy", { locale: es });
}

/**
 * Convierte un rango de tiempo (ej: "09:00 - 10:00" o "9:00 AM - 10:00 AM") a formato de 12 horas
 */
export function formatTimeRange(timeRange: string): string {
  if (!timeRange || typeof timeRange !== "string") {
    return "Horario no disponible";
  }

  if (!timeRange.includes(" - ")) {
    return timeRange;
  }

  try {
    const [startTime, endTime] = timeRange.split(" - ");

    const formatTime = (time: string): string => {
      if (!time || typeof time !== "string") {
        return "00:00";
      }

      const trimmedTime = time.trim();

      // Si ya está en formato 12 horas (contiene AM/PM), devolverlo como está
      if (trimmedTime.includes("AM") || trimmedTime.includes("PM")) {
        return trimmedTime;
      }

      // Si está en formato 24 horas, convertir
      const timeParts = trimmedTime.split(":");
      if (timeParts.length !== 2) {
        console.warn(`Invalid time format: ${trimmedTime}`);
        return trimmedTime;
      }

      const hours = Number.parseInt(timeParts[0], 10);
      const minutes = Number.parseInt(timeParts[1], 10);

      if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        console.warn(`Invalid time values: ${trimmedTime}`);
        return trimmedTime;
      }

      // Convertir a formato 12 horas
      const period = hours >= 12 ? "PM" : "AM";
      const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const formattedMinutes = minutes.toString().padStart(2, "0");

      return `${displayHour}:${formattedMinutes} ${period}`;
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  } catch (error) {
    console.error("Error formatting time range:", error);
    return timeRange;
  }
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
export function debugDate(date: Date, label = "Date"): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`🕐 ${label}:`);
    console.log(`  UTC: ${date.toISOString()}`);
    console.log(`  Peru: ${format(toPeruTime(date), "yyyy-MM-dd HH:mm:ss zzz", { locale: es })}`);
    console.log(`  Local: ${date.toLocaleString()}`);
  }
}
