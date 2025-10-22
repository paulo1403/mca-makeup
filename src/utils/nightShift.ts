/**
 * Utilities para manejar  // Horario nocturno: 19:30 (1170 min) hasta 06:00 (360 min del día siguiente)
  const nightStartMinutes = 19 * 60 + 30; // 19:30 = 1170 minutos
  const nightEndMinutes = 6 * 60; // 06:00 = 360 minutos
  
  // Está en turno nocturno si está después de las 19:30 o antes de las 06:00turno nocturno si está después de las 19:30 o antes de las 06:00
 * Costo extra de S/ 50.00 para citas entre 19:30 PM y 06:00 AM
 */

export const NIGHT_SHIFT_COST = 50.0;

/**
 * Determina si un horario está dentro del rango nocturno (19:30 - 06:00)
 * @param timeString - Horario en formato "HH:mm" o "HH:mm - HH:mm"
 * @returns boolean - true si está en horario nocturno
 */
export function isNightShift(timeString: string): boolean {
  if (!timeString) return false;

  // Extraer la hora de inicio del string
  const startTimeStr = timeString.includes(" - ")
    ? timeString.split(" - ")[0].trim()
    : timeString.trim();

  // Parsear la hora
  const [hoursStr, minutesStr] = startTimeStr.split(":");
  const hours = Number.parseInt(hoursStr, 10);
  const minutes = Number.parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes)) return false;

  // Convertir a minutos desde medianoche
  const totalMinutes = hours * 60 + minutes;

  // Horario nocturno: 19:30 (1170 min) hasta 06:00 (360 min del día siguiente)
  const nightStartMinutes = 19 * 60 + 30; // 19:30 = 1170 minutos
  const nightEndMinutes = 6 * 60; // 06:00 = 360 minutos

  // Horario nocturno si está después de 19:30 O antes de 06:00
  return totalMinutes >= nightStartMinutes || totalMinutes < nightEndMinutes;
}

/**
 * Calcula el costo nocturno si aplica
 * @param timeString - Horario de la cita
 * @returns number - Costo nocturno (50.0 si aplica, 0 si no)
 */
export function calculateNightShiftCost(timeString: string): number {
  return isNightShift(timeString) ? NIGHT_SHIFT_COST : 0;
}

/**
 * Formatea el texto explicativo del costo por atención fuera del horario laboral
 * @returns string - Texto explicativo
 */
export function getNightShiftExplanation(): string {
  return `Costo adicional por atención fuera del horario laboral (después de 7:30 PM o antes de 6:00 AM)`;
}

/**
 * Obtiene el rango de horario nocturno como string legible
 * @returns string - Rango de horario nocturno
 */
export function getNightShiftRange(): string {
  return "7:30 PM - 6:00 AM";
}
