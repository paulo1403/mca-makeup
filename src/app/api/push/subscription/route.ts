import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PushNotificationService } from '@/lib/pushNotifications';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, subscription } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: 'Suscripción inválida' },
        { status: 400 }
      );
    }

    // Usar el userId del body si está presente, sino usar el de la sesión
    const targetUserId = userId || session.user.id;

    // Guardar la suscripción
    const userAgent = request.headers.get('user-agent') || undefined;
    await PushNotificationService.saveSubscription(
      targetUserId,
      subscription,
      userAgent
    );

    return NextResponse.json({
      success: true,
      message: 'Suscripción guardada exitosamente'
    });

  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Eliminar la suscripción
    await PushNotificationService.removeSubscription(session.user.id);

    return NextResponse.json({
      success: true,
      message: 'Suscripción eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error removing push subscription:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
