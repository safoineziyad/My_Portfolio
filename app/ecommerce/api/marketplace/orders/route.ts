export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { createOrdersFromCart } from '@/ecommerce/lib/orders';
import { requireMarketplaceUser } from '@/ecommerce/lib/marketplace-auth';

export async function GET(request: NextRequest) {
  try {
    const auth = requireMarketplaceUser(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;

    const orders = await prisma.marketplaceOrder.findMany({
      where: { userId },
      include: {
        items: true,
        vendor: { select: { businessName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireMarketplaceUser(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;
    const { shippingAddress, paymentMethod } = await request.json();

    try {
      const orders = await createOrdersFromCart(userId, {
        paymentMethod: paymentMethod || 'card',
        paymentStatus: 'pending',
        shippingAddress,
      });
      return NextResponse.json(orders, { status: 201 });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      return NextResponse.json({ error: message }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
