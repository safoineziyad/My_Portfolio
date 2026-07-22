import { NextRequest, NextResponse } from 'next/server';
import { readCafeDb, writeCafeDb } from '@/lib/cafe-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customerName, customerEmail, customerPhone, address, specialInstructions, items, paymentMethod } = body;
  if (!customerName || !customerEmail || !customerPhone || !address || !items?.length) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }
  const db = await readCafeDb();
  const orderNumber = 'CAFE-' + Date.now();
  let total = 0;
  const orderItems = items.map((item: { id: number; name: string; quantity: number; price: number }) => {
    const menuItem = db.menu.find((m) => m.id === item.id);
    const price = menuItem ? menuItem.price : item.price;
    total += price * item.quantity;
    return { menuItemId: item.id, name: menuItem ? menuItem.name : item.name, quantity: item.quantity, priceAtTime: price };
  });
  const tax = Math.round(total * 0.1 * 100) / 100;
  total = Math.round((total + tax) * 100) / 100;
  const newOrder = {
    id: Date.now().toString(), orderNumber, customerName, customerEmail, customerPhone,
    address, specialInstructions: specialInstructions || '', items: orderItems,
    status: 'pending', paymentMethod: paymentMethod || 'cash', paymentStatus: 'pending',
    total, createdAt: new Date().toISOString(),
  };
  db.orders.push(newOrder);
  await writeCafeDb(db);
  return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
}
