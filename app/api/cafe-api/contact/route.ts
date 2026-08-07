import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb, writeCafeDb } from '@/lib/cafe-db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(`cafe-contact:${getClientIp(request)}`, { limit: 5, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
  }

  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }
    const db = await readCafeDb();
    db.contactMessages.push({ id: Date.now(), name, email, message, createdAt: new Date().toISOString() });
    await writeCafeDb(db);

    logger.info('Cafe contact message received', { name, email });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    logger.error('Cafe contact message failed', { error: err });
    return NextResponse.json({ success: false, message: 'Failed to save message' }, { status: 500 });
  }
}
