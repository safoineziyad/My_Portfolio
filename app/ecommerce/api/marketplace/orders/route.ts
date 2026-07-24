import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

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
    const { userId, shippingAddress, paymentMethod } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const cart = await prisma.marketplaceCart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, vendorId: true, stock: true, status: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate stock and product status before creating orders
    for (const item of cart.items) {
      if (item.product.status !== 'active') {
        return NextResponse.json(
          { error: `Product "${item.product.name}" is no longer available` },
          { status: 400 }
        );
      }
      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${item.product.name}" (available: ${item.product.stock})` },
          { status: 400 }
        );
      }
    }

    const vendorGroups: Record<string, typeof cart.items> = {};
    for (const item of cart.items) {
      const vid = item.product.vendorId;
      if (!vendorGroups[vid]) vendorGroups[vid] = [];
      vendorGroups[vid].push(item);
    }

    const orders = [];
    for (const [vendorId, items] of Object.entries(vendorGroups)) {
      const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const tax = Math.round(subtotal * 0.1 * 100) / 100;
      const shipping = 5.99;
      const total = subtotal + tax + shipping;

      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const order = await prisma.marketplaceOrder.create({
        data: {
          orderNumber,
          userId,
          vendorId,
          subtotal,
          tax,
          shipping,
          total,
          shippingAddress: shippingAddress || null,
          paymentMethod: paymentMethod || 'card',
          paymentStatus: 'pending',
          items: {
            create: items.map((item) => ({
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              total: item.product.price * item.quantity,
              productId: item.product.id,
            })),
          },
          timeline: {
            create: { status: 'pending', note: 'Order placed' },
          },
        },
        include: { items: true },
      });

      for (const item of items) {
        await prisma.marketplaceProduct.update({
          where: { id: item.product.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      orders.push(order);
    }

    await prisma.marketplaceCartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json(orders, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
