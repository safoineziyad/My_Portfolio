import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb, writeCafeDb } from '@/lib/cafe-db';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { cafeOrderSchema } from '@/lib/validations';
import { sendOrderConfirmation } from '@/lib/email';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(`cafe-order:${getClientIp(request)}`, { limit: 10, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = cafeOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    }
    const { customerName, customerPhone, items, notes } = parsed.data;
    const { customerEmail, address, specialInstructions } = body;

    if (!customerEmail || !address) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const db = await readCafeDb();
    const orderNumber = 'CAFE-' + Date.now();
    let total = 0;
    const orderItems = items.map((item) => {
      const menuItem = db.menu.find((m) => m.id === item.id);
      const price = menuItem ? menuItem.price : item.price;
      total += price * item.quantity;
      return { menuItemId: item.id, name: menuItem ? menuItem.name : item.name, quantity: item.quantity, priceAtTime: price };
    });
    const tax = Math.round(total * 0.1 * 100) / 100;
    total = Math.round((total + tax) * 100) / 100;
    const newOrder = {
      id: Date.now().toString(), orderNumber, customerName, customerEmail, customerPhone,
      address, specialInstructions: specialInstructions || notes || '', items: orderItems,
      status: 'pending', paymentMethod: body.paymentMethod || 'cash', paymentStatus: 'pending',
      total, createdAt: new Date().toISOString(),
    };
    db.orders.push(newOrder);
    await writeCafeDb(db);

    logger.info('Cafe order created', { orderNumber, total });

    sendOrderConfirmation({
      customerEmail,
      customerName,
      orderNumber,
      items: orderItems.map((i) => ({ name: i.name, quantity: i.quantity, price: i.priceAtTime })),
      total,
    }).catch((err) => logger.error('Failed to send cafe order email', { error: err }));

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (err) {
    logger.error('Cafe order creation failed', { error: err });
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}
