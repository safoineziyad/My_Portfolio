import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

function ok(req: NextRequest) { return req.headers.get('x-api-key') === process.env.CAFE_API_KEY; }

export async function GET(request: NextRequest) {
  if (!ok(request)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const db = await readCafeDb();
  return NextResponse.json({ success: true, data: {
    totalOrders: (db.orders || []).length,
    totalReservations: (db.reservations || []).length,
    totalMenuItems: db.menu.length,
  }});
}
