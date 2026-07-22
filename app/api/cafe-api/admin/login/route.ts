import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  if (username === process.env.CAFE_ADMIN_USER && password === process.env.CAFE_ADMIN_PASS) {
    return NextResponse.json({ success: true, apiKey: process.env.CAFE_API_KEY });
  }
  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
