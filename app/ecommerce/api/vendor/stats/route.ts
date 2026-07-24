import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json({ error: 'vendorId required' }, { status: 400 });
    }

    const [totalProducts, pendingOrders, revenueResult, vendor] = await Promise.all([
      prisma.marketplaceProduct.count({ where: { vendorId } }),
      prisma.marketplaceOrder.count({ where: { vendorId, status: { in: ['pending', 'paid', 'packing', 'shipped'] } } }),
      prisma.marketplaceOrder.aggregate({
        where: { vendorId, status: { in: ['paid', 'shipped', 'delivered', 'completed'] } },
        _sum: { total: true },
      }),
      prisma.vendor.findUnique({ where: { id: vendorId }, select: { rating: true } }),
    ]);

    return NextResponse.json({
      totalProducts,
      pendingOrders,
      revenue: revenueResult._sum.total || 0,
      rating: vendor?.rating || 0,
    });
  } catch (error) {
    console.error('Failed to fetch vendor stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
