import { prisma } from "@/lib/prisma";
import { getClientIP, loginRateLimiter, suspiciousIPLimiter } from "@/lib/rateLimiter";
import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validar que se proporcionaron email y password
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email y contraseña son requeridos",
          code: "MISSING_CREDENTIALS",
        },
        { status: 400 },
      );
    }

    const clientIP = getClientIP(request);

    // Verificar rate limiting por IP
    if (suspiciousIPLimiter.isBlocked(clientIP)) {
      const timeLeft = suspiciousIPLimiter.getBlockTimeLeft(clientIP);
      const minutes = Math.ceil(timeLeft / 60);

      console.log(`🚨 IP blocked: ${clientIP} for ${minutes} minutes`);

      return NextResponse.json(
        {
          error: `Demasiados intentos desde esta dirección IP. Intenta de nuevo en ${minutes} minutos.`,
          code: "IP_BLOCKED",
          timeLeft,
          blockedUntil: new Date(Date.now() + timeLeft * 1000).toISOString(),
        },
        { status: 429 },
      );
    }

    // Verificar rate limiting por email
    if (loginRateLimiter.isBlocked(email)) {
      const timeLeft = loginRateLimiter.getBlockTimeLeft(email);
      const minutes = Math.ceil(timeLeft / 60);

      console.log(`🚨 Email blocked: ${email} for ${minutes} minutes`);

      return NextResponse.json(
        {
          error: `Esta cuenta está temporalmente bloqueada. Intenta de nuevo en ${minutes} minutos.`,
          code: "ACCOUNT_BLOCKED",
          timeLeft,
          blockedUntil: new Date(Date.now() + timeLeft * 1000).toISOString(),
        },
        { status: 429 },
      );
    }

    // Intentar autenticar al usuario
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        // Usuario no encontrado - registrar intento fallido
        const ipResult = suspiciousIPLimiter.recordFailedAttempt(clientIP);
        const emailResult = loginRateLimiter.recordFailedAttempt(email);

        console.log(`❌ Login failed - User not found: ${email} from IP: ${clientIP}`);

        return NextResponse.json(
          {
            error: "Credenciales inválidas",
            code: "INVALID_CREDENTIALS",
            attemptsLeft: Math.min(ipResult.attemptsLeft, emailResult.attemptsLeft),
          },
          { status: 401 },
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        // Contraseña incorrecta - registrar intento fallido
        const ipResult = suspiciousIPLimiter.recordFailedAttempt(clientIP);
        const emailResult = loginRateLimiter.recordFailedAttempt(email);

        console.log(`❌ Login failed - Invalid password: ${email} from IP: ${clientIP}`);

        return NextResponse.json(
          {
            error: "Credenciales inválidas",
            code: "INVALID_CREDENTIALS",
            attemptsLeft: Math.min(ipResult.attemptsLeft, emailResult.attemptsLeft),
          },
          { status: 401 },
        );
      }

      // Login exitoso - limpiar intentos fallidos
      loginRateLimiter.recordSuccessfulAttempt(email);
      suspiciousIPLimiter.recordSuccessfulAttempt(clientIP);

      console.log(`✅ Login successful: ${email} from IP: ${clientIP}`);

      return NextResponse.json({
        message: "Credenciales válidas",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (dbError) {
      console.error("Database error during authentication:", dbError);

      // En caso de error de base de datos, aún registrar como intento sospechoso
      suspiciousIPLimiter.recordFailedAttempt(clientIP);

      return NextResponse.json(
        {
          error: "Error interno del servidor",
          code: "INTERNAL_ERROR",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in login verification:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

// Endpoint GET para verificar el estado de rate limiting
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    const clientIP = getClientIP(request);

    const ipStatus = suspiciousIPLimiter.getStatus(clientIP);
    const emailStatus = email ? loginRateLimiter.getStatus(email) : null;

    return NextResponse.json({
      ip: {
        address: clientIP,
        isBlocked: ipStatus.isBlocked,
        attemptsLeft: ipStatus.attemptsLeft,
        blockedUntil: ipStatus.blockedUntil,
        resetTime: ipStatus.resetTime,
      },
      email: emailStatus
        ? {
            address: email,
            isBlocked: emailStatus.isBlocked,
            attemptsLeft: emailStatus.attemptsLeft,
            blockedUntil: emailStatus.blockedUntil,
            resetTime: emailStatus.resetTime,
          }
        : null,
    });
  } catch (error) {
    console.error("Error getting rate limit status:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
