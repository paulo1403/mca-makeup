import { z } from "zod";

// Esquemas de validación
export const loginSchema = z.object({
  email: z.string().min(1, "El email es requerido").email("Ingresa un email válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Rate limiting types
export interface RateLimitInfo {
  isBlocked: boolean;
  attemptsLeft: number;
  blockedUntil?: string;
  timeLeft?: number;
}

export interface RateLimitStatus {
  ip: {
    address: string;
    isBlocked: boolean;
    attemptsLeft: number;
    blockedUntil?: string;
    resetTime?: string;
  };
  email?: {
    address: string;
    isBlocked: boolean;
    attemptsLeft: number;
    blockedUntil?: string;
    resetTime?: string;
  };
}

// Utilidades de formato
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Utilidades de rate limiting
export const getMostRestrictiveRateLimit = (rateLimitStatus: RateLimitStatus): RateLimitInfo => {
  const { ip, email } = rateLimitStatus;

  const isBlocked = ip.isBlocked || (email?.isBlocked ?? false);
  const attemptsLeft = Math.min(ip.attemptsLeft, email?.attemptsLeft ?? 999);
  const blockedUntil = ip.blockedUntil || email?.blockedUntil;

  return {
    isBlocked,
    attemptsLeft,
    blockedUntil,
  };
};

// Utilidades de tiempo para countdown
export const calculateTimeLeft = (blockedUntil: string): number => {
  const now = new Date().getTime();
  const blockedTime = new Date(blockedUntil).getTime();
  return Math.max(0, Math.ceil((blockedTime - now) / 1000));
};
