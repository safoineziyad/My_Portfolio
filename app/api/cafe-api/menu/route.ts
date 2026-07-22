import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const db = await readCafeDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const popular = searchParams.get('popular');
  let items = db.menu;
  if (category) items = items.filter((i) => i.category === category);
  if (popular === 'true') items = items.filter((i) => i.isPopular);
  return NextResponse.json({ success: true, data: items });
}
