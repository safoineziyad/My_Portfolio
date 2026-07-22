import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb, writeCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const { name, email, message } = await request.json();
  if (!name || !email || !message) return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
  const db = await readCafeDb();
  db.contactMessages.push({ id: Date.now(), name, email, message, createdAt: new Date().toISOString() });
  await writeCafeDb(db);
  return NextResponse.json({ success: true }, { status: 201 });
}
