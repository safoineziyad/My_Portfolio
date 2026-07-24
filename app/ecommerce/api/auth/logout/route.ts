import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/ecommerce/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const token = cookieHeader.split(';').find(c => c.trim().startsWith('session_token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await destroySession(token);

    const response = NextResponse.json({ success: true });

    response.headers.set(
      'Set-Cookie',
      'session_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax'
    );

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
