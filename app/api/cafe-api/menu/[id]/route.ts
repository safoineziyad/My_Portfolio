import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await readCafeDb();
  const item = db.menu.find((i) => i.id === Number(params.id));
  if (!item) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: item });
}
