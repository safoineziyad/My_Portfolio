import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb, writeCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, date, time, guests, specialRequests } = body;
  if (!name || !email || !phone || !date || !time || !guests) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }
  const db = await readCafeDb();
  const newReservation = {
    id: Date.now(), name, email, phone, date, time,
    guests: parseInt(guests), specialRequests: specialRequests || '',
    status: 'pending', createdAt: new Date().toISOString(),
  };
  db.reservations.push(newReservation);
  await writeCafeDb(db);
  return NextResponse.json({ success: true, reservation: newReservation }, { status: 201 });
}
