import prisma from '@/ecommerce/lib/db';

export async function createOrdersFromCart(
  userId: string,
  opts: {
    paymentMethod: string;
    paymentStatus: string;
    shippingAddress?: string;
    stripeSessionId?: string;
  }
) {
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

  if (!cart || cart.items.length === 0) return [];

  for (const item of cart.items) {
    if (item.product.status !== 'active') {
      throw new Error(`Product "${item.product.name}" is no longer available`);
    }
    if (item.product.stock < item.quantity) {
      throw new Error(`Insufficient stock for "${item.product.name}" (available: ${item.product.stock})`);
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
        shippingAddress: opts.shippingAddress || null,
        paymentMethod: opts.paymentMethod,
        paymentStatus: opts.paymentStatus,
        stripeSessionId: opts.stripeSessionId || null,
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
          create: { status: 'pending', note: opts.paymentStatus === 'paid' ? 'Payment received' : 'Order placed' },
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

  return orders;
}
