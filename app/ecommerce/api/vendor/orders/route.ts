export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { requireVendor } from '@/ecommerce/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireVendor(request);
    if ('error' in auth) return auth.error;
    const vendorId = auth.vendorId;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

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
    const auth = await requireVendor(request);
    if ('error' in auth) return auth.error;
    const vendorId = auth.vendorId;
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status required' }, { status: 400 });
    }

    const allowedStatuses = ['pending', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` }, { status: 400 });
    }

    const order = await prisma.marketplaceOrder.findUnique({ where: { id: orderId } });
    if (!order || order.vendorId !== vendorId) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updated = await prisma.marketplaceOrder.update({
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
