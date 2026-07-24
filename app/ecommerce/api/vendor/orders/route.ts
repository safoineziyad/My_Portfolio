export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!vendorId) {
      return NextResponse.json({ error: 'vendorId required' }, { status: 400 });
    }

    const where: any = { vendorId };
    if (status && status !== 'all') {
      where.status = status;
    }

    const data = await prisma.marketplaceOrder.findMany({
      where,
      include: {
        items: true,
        user: { select: { id: true, name: true, email: true } },
        timeline: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Failed to fetch vendor orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status required' }, { status: 400 });
    }

    const allowedStatuses = ['pending', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` }, { status: 400 });
    }

    const order = await prisma.marketplaceOrder.update({
      where: { id: orderId },
      data: { status },
    });

    await prisma.marketplaceOrderTimeline.create({
      data: {
        status,
        note: `Status updated to ${status} by vendor`,
        orderId,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
