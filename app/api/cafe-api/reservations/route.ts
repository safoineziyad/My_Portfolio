import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb, writeCafeDb } from '@/lib/cafe-db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { cafeReservationSchema } from '@/lib/validations';
import { sendReservationConfirmation } from '@/lib/email';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(`cafe-reservation:${getClientIp(request)}`, { limit: 10, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = cafeReservationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    }
    const { name, phone, date, time, guests } = parsed.data;
    const email = body.email || '';
    const specialRequests = body.specialRequests || '';

    const db = await readCafeDb();
    const newReservation = {
      id: Date.now(), name, email, phone, date, time,
      guests, specialRequests,
      status: 'pending', createdAt: new Date().toISOString(),
    };
    db.reservations.push(newReservation);
    await writeCafeDb(db);

    logger.info('Cafe reservation created', { name, date, time, guests });

    if (email) {
      sendReservationConfirmation({
        customerEmail: email,
        customerName: name,
        date,
        time,
        guests,
      }).catch((err) => logger.error('Failed to send reservation email', { error: err }));
    }

    return NextResponse.json({ success: true, reservation: newReservation }, { status: 201 });
  } catch (err) {
    logger.error('Cafe reservation creation failed', { error: err });
    return NextResponse.json({ success: false, message: 'Failed to create reservation' }, { status: 500 });
  }
}
