import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Obtener la clave VAPID pública desde las variables de entorno
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
      console.error('VAPID_PUBLIC_KEY no está configurada');
      return NextResponse.json(
        { error: 'VAPID public key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      publicKey: vapidPublicKey
    });
  } catch (error) {
    console.error('Error getting VAPID public key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
