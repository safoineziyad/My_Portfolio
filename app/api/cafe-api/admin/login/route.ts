import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  const adminUser = process.env.CAFE_ADMIN_USER;
  const adminHash = process.env.CAFE_ADMIN_PASS_HASH;

  if (
    adminUser &&
    adminHash &&
    typeof username === 'string' &&
    typeof password === 'string' &&
    username === adminUser &&
    bcrypt.compareSync(password, adminHash)
  ) {
    return NextResponse.json({ success: true, apiKey: process.env.CAFE_API_KEY });
  }

  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
