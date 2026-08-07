import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { createOrdersFromCart } from '@/ecommerce/lib/orders';
import { readCafeDb } from '@/lib/cafe-db';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { session_id, items: cafeItems } = await request.json();
    if (!session_id) {
      return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment has not been completed' }, { status: 400 });
    }

    if (session.metadata?.kind === 'cafe') {
      const existing = await prisma.cafeOrder.findUnique({ where: { stripeSessionId: session_id } });
      if (existing) {
        return NextResponse.json({ success: true, order: existing });
      }

      const { customerName, customerEmail, customerPhone, address, specialInstructions } = session.metadata;
      const items = Array.isArray(cafeItems) && cafeItems.length > 0
        ? cafeItems
        : (session.line_items?.data || []).map((li) => ({
            id: 0,
            name: li.description || 'Item',
            price: (li.amount_total || 0) / 100 / Math.max(li.quantity || 1, 1),
            quantity: li.quantity || 1,
          }));

      const db = await readCafeDb();
      let total = 0;
      const orderItems = items.map((item: { id?: number; name: string; price: number; quantity: number }) => {
        const menuItem = typeof item.id === 'number' ? db.menu.find((m) => m.id === item.id) : undefined;
        const price = menuItem ? menuItem.price : item.price;
        total += price * item.quantity;
        return { menuItemId: menuItem ? menuItem.id : item.id || 0, name: menuItem ? menuItem.name : item.name, quantity: item.quantity, priceAtTime: price };
      });
      const tax = Math.round(total * 0.1 * 100) / 100;
      total = Math.round((total + tax) * 100) / 100;

      const orderNumber = 'CAFE-' + Date.now();
      const order = await prisma.cafeOrder.create({
        data: {
          id: Date.now().toString(),
          orderNumber,
          customerName,
          customerEmail,
          customerPhone,
          address,
          specialInstructions: specialInstructions || '',
          status: 'pending',
          paymentMethod: 'card',
          paymentStatus: 'paid',
          stripeSessionId: session_id,
          total,
          createdAt: new Date().toISOString(),
          items: { create: orderItems },
        },
      });

      logger.info('Cafe order created after Stripe payment', { orderNumber, total });
      return NextResponse.json({ success: true, order });
    }

    const userId = session.metadata?.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Checkout session is missing account information' }, { status: 400 });
    }

    const existingOrders = await prisma.marketplaceOrder.findMany({ where: { stripeSessionId: session_id } });
    if (existingOrders.length > 0) {
      return NextResponse.json({ success: true, orders: existingOrders });
    }

    const orders = await createOrdersFromCart(userId, {
      paymentMethod: 'card',
      paymentStatus: 'paid',
      shippingAddress: session.metadata?.shippingAddress || undefined,
      stripeSessionId: session_id,
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Order has already been processed' }, { status: 409 });
    }
    logger.error('Stripe verify error', { error });
    return NextResponse.json({ error: 'Failed to complete order' }, { status: 500 });
  }
}
