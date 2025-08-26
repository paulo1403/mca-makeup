import { NextRequest, NextResponse } from 'next/server';
import { sendToSubscription } from '@/lib/push';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscription, title, body: bodyText } = body;

    if (!subscription) {
      return NextResponse.json({ success: false, message: 'Missing subscription' }, { status: 400 });
    }

    const payload = { title: title || 'Direct Test', body: bodyText || 'Prueba' };

    const res = await sendToSubscription(subscription, payload);

    return NextResponse.json({ success: true, result: res });
  } catch (err) {
    console.error('Error sending direct push', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
