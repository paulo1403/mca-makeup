/**
 * Utilities para manejo de horario nocturno
 * - Sociales / Piel madura / Peinado: S/ 50 entre 19:30 y 06:00
 * - Novias (BRIDAL): S/ 80 entre 19:30 y 06:00, excepto Lurin/Pachacamac/Cieneguilla donde es hasta 07:00
 */

export const NIGHT_SHIFT_COST = 50.0;
export const NIGHT_SHIFT_COST_SOCIAL = 50.0;
export const NIGHT_SHIFT_COST_BRIDAL = 80.0;

const FAR_DISTRICTS = ["lurin", "pachacamac", "cieneguilla"];

function normalizeDistrict(district: string | null | undefined): string {
  if (!district) return "";
  return district
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getNightEndMinutes(district: string | null | undefined, isBridal: boolean): number {
  const normalized = normalizeDistrict(district);
  const isFar = FAR_DISTRICTS.includes(normalized);
  // ponytail: novias en distritos lejanos hasta 7am, resto hasta 6am
  if (isBridal && isFar) return 7 * 60; // 07:00
  return 6 * 60; // 06:00
}

/**
 * Determina si un horario está dentro del rango nocturno
 * @param timeString - Horario en formato "HH:mm" o "HH:mm - HH:mm"
 * @param district - Distrito opcional para ventana extendida
 * @param isBridal - true si incluye servicio de novia
 */
export function isNightShift(timeString: string, district?: string | null, isBridal?: boolean): boolean {
  if (!timeString) return false;

  const startTimeStr = timeString.includes(" - ")
    ? timeString.split(" - ")[0].trim()
    : timeString.trim();

  const [hoursStr, minutesStr] = startTimeStr.split(":");
  const hours = Number.parseInt(hoursStr, 10);
  const minutes = Number.parseInt(minutesStr, 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;

  const totalMinutes = hours * 60 + minutes;
  const nightStartMinutes = 19 * 60 + 30; // 19:30
  const nightEndMinutes = getNightEndMinutes(district, !!isBridal);

  return totalMinutes >= nightStartMinutes || totalMinutes < nightEndMinutes;
}

/**
 * Calcula el costo nocturno si aplica
 * @param timeString - Horario de la cita
 * @param district - Distrito opcional
 * @param isBridal - true si incluye novia (cobra S/80, sino S/50)
 */
export function calculateNightShiftCost(
  timeString: string,
  district?: string | null,
  isBridal?: boolean,
): number {
  if (!isNightShift(timeString, district, isBridal)) return 0;
  return isBridal ? NIGHT_SHIFT_COST_BRIDAL : NIGHT_SHIFT_COST_SOCIAL;
}

/**
 * Formatea el texto explicativo del costo por atención fuera del horario laboral
 */
export function getNightShiftExplanation(district?: string | null, isBridal?: boolean): string {
  const isFar = FAR_DISTRICTS.includes(normalizeDistrict(district));
  if (isBridal && isFar) return "Costo adicional S/ 80 por atención nocturna (7:30 PM - 7:00 AM, distritos lejanos)";
  if (isBridal) return "Costo adicional S/ 80 por atención nocturna novias (7:30 PM - 6:00 AM)";
  return "Costo adicional S/ 50 por atención fuera del horario laboral (después de 7:30 PM o antes de 6:00 AM)";
}

/**
 * Obtiene el rango de horario nocturno como string legible
 */
export function getNightShiftRange(district?: string | null, isBridal?: boolean): string {
  const isFar = FAR_DISTRICTS.includes(normalizeDistrict(district));
  if (isBridal && isFar) return "7:30 PM - 7:00 AM";
  return "7:30 PM - 6:00 AM";
}
