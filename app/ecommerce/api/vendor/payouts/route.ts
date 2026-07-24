import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json({ error: 'vendorId required' }, { status: 400 });
    }

    const data = await prisma.payout.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Failed to fetch payouts:', error);
    return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendorId, amount, method } = body;

    if (!vendorId || !amount) {
      return NextResponse.json({ error: 'vendorId and amount required' }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 });
    }

    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    const completedOrders = await prisma.marketplaceOrder.aggregate({
      where: { vendorId, status: 'delivered' },
      _sum: { total: true },
    });

    const totalPaid = await prisma.payout.aggregate({
      where: { vendorId, status: { in: ['pending', 'completed'] } },
      _sum: { amount: true },
    });

    const earnings = (completedOrders._sum.total || 0) * (1 - vendor.commissionRate);
    const alreadyPaid = totalPaid._sum.amount || 0;
    const available = earnings - alreadyPaid;

    if (parsedAmount > available) {
      return NextResponse.json(
        { error: `Insufficient earnings. Available: ${Math.max(0, available).toFixed(2)}` },
        { status: 400 }
      );
    }

    const payout = await prisma.payout.create({
      data: {
        amount: parsedAmount,
        method: method || 'bank_transfer',
        status: 'pending',
        vendorId,
      },
    });

    return NextResponse.json(payout, { status: 201 });
  } catch (error) {
    console.error('Failed to create payout:', error);
    return NextResponse.json({ error: 'Failed to create payout' }, { status: 500 });
  }
}
