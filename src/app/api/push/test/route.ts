import { NextRequest, NextResponse } from 'next/server';
import { sendPushToAll } from '@/lib/push';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, body: bodyText } = body;

    await sendPushToAll({ title: title || 'Test Notification', body: bodyText || 'Prueba desde admin' });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error sending test push', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
