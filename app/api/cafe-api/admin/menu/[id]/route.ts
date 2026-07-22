import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb, writeCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

function ok(req: NextRequest) { return req.headers.get('x-api-key') === process.env.CAFE_API_KEY; }

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!ok(request)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const db = await readCafeDb();
  const item = db.menu.find((i) => i.id === Number(params.id));
  if (!item) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  const body = await request.json();
  if (body.name) item.name = body.name;
  if (body.description) item.description = body.description;
  if (body.price) item.price = parseFloat(body.price);
  if (body.category) item.category = body.category;
  if (body.image !== undefined) item.image = body.image;
  await writeCafeDb(db);
  return NextResponse.json({ success: true, item });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!ok(request)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  const db = await readCafeDb();
  db.menu = db.menu.filter((i) => i.id !== Number(params.id));
  await writeCafeDb(db);
  return NextResponse.json({ success: true });
}
