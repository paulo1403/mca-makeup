import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    return NextResponse.json({
      session: session,
      timestamp: new Date().toISOString(),
      status: 'ok',
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json(
      {
        error: 'Error getting session',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
