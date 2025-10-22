"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { type RateLimitInfo, formatTime } from "@/lib/auth-utils";

interface RateLimitAlertsProps {
  rateLimitInfo: RateLimitInfo | null;
  onExpired?: () => void;
}

export const RateLimitAlerts = ({ rateLimitInfo, onExpired }: RateLimitAlertsProps) => {
  const { timeLeft, isExpired } = useCountdown(rateLimitInfo?.blockedUntil);

  // Llamar onExpired cuando expire el countdown
  if (isExpired && rateLimitInfo?.isBlocked && onExpired) {
    onExpired();
  }

  if (!rateLimitInfo) return null;

  // Alerta de bloqueo
  if (rateLimitInfo.isBlocked) {
    return (
      <div className="bg-[var(--status-cancelled-bg)] border border-[var(--status-cancelled-border)] rounded-lg p-4 text-[var(--status-cancelled-text)]">
        <div className="flex items-center space-x-3">
          <div>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Cuenta temporalmente bloqueada</h3>
            <p className="text-sm mt-1">
              Demasiados intentos fallidos. Tiempo restante: {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Alerta de advertencia (quedan pocos intentos)
  if (rateLimitInfo.attemptsLeft < 5) {
    return (
      <div className="bg-[var(--status-pending-bg)] border border-[var(--status-pending-border)] rounded-lg p-4 text-[var(--status-pending-text)]">
        <div className="flex items-center space-x-3">
          <div>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm">
              Te quedan <strong>{rateLimitInfo.attemptsLeft}</strong> intento
              {rateLimitInfo.attemptsLeft !== 1 ? "s" : ""} antes del bloqueo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
