export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { createSession, verifyPassword } from '@/ecommerce/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const member = await prisma.teamMember.findUnique({ where: { email } });

    if (!member) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!member.isActive) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 });
    }

    const valid = await verifyPassword(password, member.passwordHash);

    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await createSession(member.id);

    const response = NextResponse.json({
      success: true,
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });

    response.headers.set(
      'Set-Cookie',
      `session_token=${token}; Path=/; HttpOnly; Max-Age=604800; SameSite=Lax`
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
