export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { requireAdmin } from '@/ecommerce/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        items: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
        timeline: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    await prisma.orderStatusHistory.create({
      data: {
        status,
        note: `Status updated to ${status}`,
        orderId: params.id,
      },
    });

    await prisma.orderTimelineEntry.create({
      data: {
        action: 'status_update',
        details: `Order status changed to ${status}`,
        orderId: params.id,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
