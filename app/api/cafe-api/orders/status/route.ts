import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const email = new URL(request.url).searchParams.get('email');
  if (!email) return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });
  const db = await readCafeDb();
  const orders = db.orders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
  return NextResponse.json({ success: true, data: orders });
}
