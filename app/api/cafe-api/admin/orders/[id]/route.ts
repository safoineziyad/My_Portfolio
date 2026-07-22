import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb, writeCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

function ok(req: NextRequest) { return req.headers.get('x-api-key') === process.env.CAFE_API_KEY; }

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!ok(request)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const db = await readCafeDb();
  const order = (db.orders || []).find((o) => o.id === params.id);
  if (!order) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  const { status } = await request.json();
  order.status = status;
  await writeCafeDb(db);
  return NextResponse.json({ success: true, order });
}
