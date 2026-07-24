import { NextRequest, NextResponse } from 'next/server';
import { getMemberFromRequest } from '@/ecommerce/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const member = await getMemberFromRequest(request);

    if (!member) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json({
      member: {
        id: member.memberId,
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });
  } catch (error) {
    console.error('Get member error:', error);
    return NextResponse.json({ error: 'Failed to get member' }, { status: 500 });
  }
}
