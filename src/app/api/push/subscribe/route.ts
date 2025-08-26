import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys) {
      return NextResponse.json({ success: false, message: 'Invalid subscription' }, { status: 400 });
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: { keys },
      create: { endpoint, keys },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
