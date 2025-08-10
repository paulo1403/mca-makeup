// utils/dateRange.ts

/**
 * Parsea un string de tiempo con soporte para AM/PM
 */
function parseTimeWithAMPM(timeString: string): {
  hours: number;
  minutes: number;
} {
  // Regex para manejar tanto formato inglés (AM/PM) como español (a. m./p. m.)
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM|a\.\s*m\.|p\.\s*m\.)$/i;
  const match = timeString.match(timeRegex);

  if (!match) {
    // Fallback para formato 24h sin AM/PM
    const [hoursStr, minutesStr] = timeString.split(":");
    return {
      hours: parseInt(hoursStr, 10),
      minutes: parseInt(minutesStr, 10),
    };
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toLowerCase().replace(/\s/g, ""); // Normalizar a minúsculas sin espacios

  // Convertir a formato 24h - manejar tanto AM/PM como a.m./p.m.
  const isPM = period === "pm" || period === "p.m.";
  const isAM = period === "am" || period === "a.m.";

  if (isPM && hours !== 12) {
    hours += 12;
  } else if (isAM && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

/**
 * Convierte un string de rango de hora ("09:00 - 11:30") a objetos Date de inicio y fin.
 * Si solo se recibe una hora, usa la duración (en minutos) para calcular el fin.
 */
export function parseAppointmentTime(
  appointmentDate: string,
  appointmentTime: string,
  duration?: number,
): { start: Date; end: Date } {
  // Parse date string as local date to avoid timezone issues
  const [year, month, day] = appointmentDate.split("-").map(Number);
  const date = new Date(year, month - 1, day); // month is 0-based
  let start: Date, end: Date;

  if (appointmentTime.includes(" - ")) {
    const [startStr, endStr] = appointmentTime.split(" - ");

    // Parse start time with AM/PM support
    const startTime = parseTimeWithAMPM(startStr.trim());
    const endTime = parseTimeWithAMPM(endStr.trim());

    start = new Date(date);
    start.setHours(startTime.hours, startTime.minutes, 0, 0);
    end = new Date(date);
    end.setHours(endTime.hours, endTime.minutes, 0, 0);
  } else {
    const timeInfo = parseTimeWithAMPM(appointmentTime.trim());

    start = new Date(date);
    start.setHours(timeInfo.hours, timeInfo.minutes, 0, 0);
    end = new Date(start);
    const durationMinutes = duration || 120;
    end.setTime(start.getTime() + durationMinutes * 60 * 1000);
  }

  // Log only if there are errors
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error(`⏰ ERROR: Invalid dates parsed for`, {
      appointmentDate,
      appointmentTime,
      start: start.toISOString(),
      end: end.toISOString(),
    });
  }

  return { start, end };
}
