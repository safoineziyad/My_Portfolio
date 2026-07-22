import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const email = new URL(request.url).searchParams.get('email');
  if (!email) return NextResponse.json({ success: false, message: 'Email required' }, { status: 400 });
  const db = await readCafeDb();
  const userRes = db.reservations.filter((r) => r.email.toLowerCase() === email.toLowerCase());
  if (!userRes.length) return NextResponse.json({ success: true, found: false, message: 'No reservations found.' });
  const latest = userRes[userRes.length - 1];
  const sameDay = db.reservations.filter((r) => r.date === latest.date && r.status === 'confirmed');
  const totalGuests = sameDay.reduce((s, r) => s + r.guests, 0);
  let capacityMsg = `Currently ${totalGuests} guests confirmed. Plenty of space!`;
  if (totalGuests >= 50) capacityMsg = 'Warning: The cafe is quite busy on this day!';
  if (totalGuests >= 80) capacityMsg = 'Fully booked for this day!';
  return NextResponse.json({ success: true, found: true, reservation: latest, capacityMsg });
}
