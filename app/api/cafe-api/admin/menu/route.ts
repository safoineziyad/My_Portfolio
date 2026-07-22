import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb, writeCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

function ok(req: NextRequest) { return req.headers.get('x-api-key') === process.env.CAFE_API_KEY; }

export async function POST(request: NextRequest) {
  if (!ok(request)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const { name, description, price, category, image, isPopular } = await request.json();
  if (!name || !price || !category) return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
  const db = await readCafeDb();
  const maxId = db.menu.reduce((max, item) => Math.max(max, item.id), 0);
  const newItem = {
    id: maxId + 1, name, description: description || '',
    price: parseFloat(price), category, image: image || '', isPopular: isPopular || false,
  };
  db.menu.push(newItem);
  await writeCafeDb(db);
  return NextResponse.json({ success: true, item: newItem }, { status: 201 });
}
