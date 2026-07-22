import { NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET() {
  try {
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

    return NextResponse.json({
      stats: {
        totalRevenue: Math.round((totalRevenue._sum.total || 0) * 100) / 100,
        totalOrders,
        totalCustomers,
        totalProducts,
        totalStock: totalStock._sum.stock || 0,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        revenueChange: 0,
        ordersChange: 0,
        customersChange: 0,
      },
      revenueByDay,
      topProducts,
      ordersByStatus,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
