import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const subs = await prisma.pushSubscription.findMany();
    return NextResponse.json({ success: true, data: subs });
  } catch (err) {
    console.error('Error listing subscriptions', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
