/**
 * Adelanto: S/ 150 por servicio. Si hay más de un servicio, se multiplica.
 * Ejemplo: 2 sociales => 300, 3 servicios => 450
 * ponytail: fija 150, sin config DB hasta que Marcela requiera variar
 */
export const DEPOSIT_PER_SERVICE = 150;

export function calculateDepositFromQuantity(totalQuantity: number): number {
  const qty = Math.max(1, Math.floor(totalQuantity || 1));
  return qty * DEPOSIT_PER_SERVICE;
}

export function calculateDepositForSelected(
  selected: Array<{ quantity?: number }>,
): number {
  const total = (selected || []).reduce((sum, s) => sum + (s.quantity || 1), 0);
  return calculateDepositFromQuantity(total);
}

// Para Appointment ya guardado
export function calculateDepositForAppointment(appointment: {
  services?: Array<{ quantity?: number }> | null;
  serviceType?: string;
}): number {
  if (appointment.services && Array.isArray(appointment.services) && appointment.services.length > 0) {
    const total = appointment.services.reduce((sum, s) => sum + (s.quantity || 1), 0);
    return calculateDepositFromQuantity(total);
  }
  return DEPOSIT_PER_SERVICE;
}
