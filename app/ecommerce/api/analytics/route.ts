export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { requireAdmin } from '@/ecommerce/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;

    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      totalStock,
    ] = await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'cancelled' } } }),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.product.count(),
      prisma.product.aggregate({ _sum: { stock: true } }),
    ]);

    const averageOrderValue = totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [currentOrders, previousOrders, currentCustomers, previousCustomers] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: thirtyDaysAgo }, status: { not: 'cancelled' } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }, status: { not: 'cancelled' } },
      }),
      prisma.customer.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.customer.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    ]);

    const currentRevenue = currentOrders._sum.total || 0;
    const previousRevenue = previousOrders._sum.total || 0;
    const currentOrderCount = await prisma.order.count({ where: { createdAt: { gte: thirtyDaysAgo } } });
    const previousOrderCount = await prisma.order.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } });

    const pctChange = (curr: number, prev: number) => (prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0);

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { total: true, status: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dayMap: Record<string, { revenue: number; orders: number }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dayMap[key] = { revenue: 0, orders: 0 };
    }

    for (const order of orders) {
      const key = order.createdAt.toISOString().split('T')[0];
      if (!dayMap[key]) dayMap[key] = { revenue: 0, orders: 0 };
      if (order.status !== 'cancelled') {
        dayMap[key].revenue += order.total;
      }
      dayMap[key].orders += 1;
    }

    const revenueByDay = Object.entries(dayMap).map(([date, data]) => ({
      date,
      revenue: Math.round(data.revenue * 100) / 100,
      orders: data.orders,
    }));

    const orderItems = await prisma.orderItem.findMany({
      where: { order: { createdAt: { gte: thirtyDaysAgo } } },
      select: { name: true, price: true, quantity: true },
    });

    const productRevenue: Record<string, { name: string; revenue: number; quantity: number }> = {};
    for (const item of orderItems) {
      if (!productRevenue[item.name]) {
        productRevenue[item.name] = { name: item.name, revenue: 0, quantity: 0 };
      }
      productRevenue[item.name].revenue += item.price * item.quantity;
      productRevenue[item.name].quantity += item.quantity;
    }

    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map(p => ({ ...p, revenue: Math.round(p.revenue * 100) / 100 }));

    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const ordersByStatus = statusCounts.map(s => ({
      status: s.status,
      count: s._count.status,
    }));

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        total: true,
        createdAt: true,
        customer: { select: { name: true } },
      },
    });

    const lowStockProducts = await prisma.product.findMany({
      where: { stock: { lte: 10 } },
      select: { id: true, name: true, stock: true, lowStockThreshold: true },
      orderBy: { stock: 'asc' },
      take: 10,
    });

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round((totalRevenue._sum.total || 0) * 100) / 100,
        totalOrders,
        totalCustomers,
        totalProducts,
        totalStock: totalStock._sum.stock || 0,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        revenueChange: Math.round(pctChange(currentRevenue, previousRevenue) * 100) / 100,
        ordersChange: Math.round(pctChange(currentOrderCount, previousOrderCount) * 100) / 100,
        customersChange: Math.round(pctChange(currentCustomers, previousCustomers) * 100) / 100,
      },
      revenueByDay,
      recentOrders,
      topProducts,
      ordersByStatus,
      lowStockProducts,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
