// Sistema de rate limiting en memoria (para producción usar Redis)
interface LoginAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

class RateLimiter {
  private attempts: Map<string, LoginAttempt> = new Map();
  
  // Configuración por defecto
  private config: RateLimitConfig = {
    maxAttempts: 5, // 5 intentos máximo
    windowMs: 15 * 60 * 1000, // 15 minutos
    blockDurationMs: 30 * 60 * 1000, // 30 minutos de bloqueo
  };

  constructor(config?: Partial<RateLimitConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  // Limpiar intentos expirados (garbage collection)
  private cleanExpiredAttempts() {
    const now = Date.now();
    for (const [key, attempt] of this.attempts.entries()) {
      // Limpiar intentos antiguos que ya no están en la ventana de tiempo
      if (now - attempt.lastAttempt > this.config.windowMs) {
        this.attempts.delete(key);
      }
    }
  }

  // Verificar si una IP/email está bloqueada
  isBlocked(identifier: string): boolean {
    this.cleanExpiredAttempts();
    
    const attempt = this.attempts.get(identifier);
    if (!attempt) return false;

    // Verificar si está en período de bloqueo
    if (attempt.blockedUntil && Date.now() < attempt.blockedUntil) {
      return true;
    }

    // Si pasó el tiempo de bloqueo, resetear
    if (attempt.blockedUntil && Date.now() >= attempt.blockedUntil) {
      this.attempts.delete(identifier);
      return false;
    }

    return false;
  }

  // Registrar un intento fallido
  recordFailedAttempt(identifier: string): {
    isBlocked: boolean;
    attemptsLeft: number;
    blockedUntil?: Date;
    resetTime: Date;
  } {
    this.cleanExpiredAttempts();
    
    const now = Date.now();
    const attempt = this.attempts.get(identifier) || {
      count: 0,
      lastAttempt: now,
    };

    // Si es un nuevo intento dentro de la ventana de tiempo
    if (now - attempt.lastAttempt < this.config.windowMs) {
      attempt.count++;
    } else {
      // Reset del contador si pasó la ventana de tiempo
      attempt.count = 1;
    }

    attempt.lastAttempt = now;

    // Verificar si debe ser bloqueado
    if (attempt.count >= this.config.maxAttempts) {
      attempt.blockedUntil = now + this.config.blockDurationMs;
      
      this.attempts.set(identifier, attempt);
      
      return {
        isBlocked: true,
        attemptsLeft: 0,
        blockedUntil: new Date(attempt.blockedUntil),
        resetTime: new Date(attempt.blockedUntil),
      };
    }

    this.attempts.set(identifier, attempt);

    return {
      isBlocked: false,
      attemptsLeft: this.config.maxAttempts - attempt.count,
      resetTime: new Date(now + this.config.windowMs),
    };
  }

  // Registrar un intento exitoso (limpiar intentos)
  recordSuccessfulAttempt(identifier: string) {
    this.attempts.delete(identifier);
  }

  // Obtener información sobre el estado de rate limiting
  getStatus(identifier: string): {
    isBlocked: boolean;
    attemptsLeft: number;
    blockedUntil?: Date;
    resetTime?: Date;
  } {
    this.cleanExpiredAttempts();
    
    const attempt = this.attempts.get(identifier);
    if (!attempt) {
      return {
        isBlocked: false,
        attemptsLeft: this.config.maxAttempts,
      };
    }

    const now = Date.now();
    
    // Verificar si está bloqueado
    if (attempt.blockedUntil && now < attempt.blockedUntil) {
      return {
        isBlocked: true,
        attemptsLeft: 0,
        blockedUntil: new Date(attempt.blockedUntil),
        resetTime: new Date(attempt.blockedUntil),
      };
    }

    // Si no está bloqueado, calcular intentos restantes
    const attemptsLeft = Math.max(0, this.config.maxAttempts - attempt.count);
    
    return {
      isBlocked: false,
      attemptsLeft,
      resetTime: new Date(attempt.lastAttempt + this.config.windowMs),
    };
  }

  // Obtener tiempo restante de bloqueo en segundos
  getBlockTimeLeft(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt?.blockedUntil) return 0;

    const now = Date.now();
    const timeLeft = Math.max(0, attempt.blockedUntil - now);
    return Math.ceil(timeLeft / 1000);
  }
}

// Instancia global del rate limiter
export const loginRateLimiter = new RateLimiter({
  maxAttempts: 5, // 5 intentos máximo
  windowMs: 15 * 60 * 1000, // 15 minutos
  blockDurationMs: 30 * 60 * 1000, // 30 minutos de bloqueo
});

// Rate limiter más agresivo para IPs sospechosas
export const suspiciousIPLimiter = new RateLimiter({
  maxAttempts: 10, // 10 intentos por IP en total
  windowMs: 60 * 60 * 1000, // 1 hora
  blockDurationMs: 2 * 60 * 60 * 1000, // 2 horas de bloqueo
});

// Función para obtener la IP del cliente
export function getClientIP(request: Request): string {
  // En producción con proxies/CDN
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback para desarrollo
  return 'localhost';
}
