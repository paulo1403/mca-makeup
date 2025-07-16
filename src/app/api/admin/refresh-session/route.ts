import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar si la sesión aún es válida
    const now = Date.now();
    const sessionStart = new Date(session.expires).getTime() - (2 * 60 * 60 * 1000); // Calcular inicio de sesión
    const timeElapsed = now - sessionStart;
    const maxAge = 2 * 60 * 60 * 1000; // 2 horas

    if (timeElapsed >= maxAge) {
      return NextResponse.json(
        { error: 'Sesión expirada' },
        { status: 401 }
      );
    }

    // Si la sesión es válida, retornar información actualizada
    return NextResponse.json({
      message: 'Sesión válida',
      timeLeft: Math.max(0, Math.floor((maxAge - timeElapsed) / 1000)),
      expiresAt: new Date(now + (maxAge - timeElapsed)).toISOString(),
    });

  } catch (error) {
    console.error('Error in refresh session:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
