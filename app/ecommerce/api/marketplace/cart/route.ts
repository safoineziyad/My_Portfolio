export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { requireMarketplaceUser } from '@/ecommerce/lib/marketplace-auth';

export async function GET(request: NextRequest) {
  try {
    const auth = requireMarketplaceUser(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;

    const cart = await prisma.marketplaceCart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                stock: true,
                vendor: { select: { businessName: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(cart ? cart.items : []);
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireMarketplaceUser(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;
    const { productId, quantity } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    let cart = await prisma.marketplaceCart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await prisma.marketplaceCart.create({ data: { userId } });
    }

    const existingItem = await prisma.marketplaceCartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.marketplaceCartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
      });
    } else {
      await prisma.marketplaceCartItem.create({
        data: { cartId: cart.id, productId, quantity: quantity || 1 },
      });
    }

    const updatedCart = await prisma.marketplaceCart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                stock: true,
                vendor: { select: { businessName: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedCart ? updatedCart.items : []);
  } catch (error) {
    console.error('Failed to add to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = requireMarketplaceUser(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get('cartItemId');

    if (!cartItemId) {
      return NextResponse.json({ error: 'cartItemId is required' }, { status: 400 });
    }

    const cart = await prisma.marketplaceCart.findUnique({ where: { userId } });
    const item = cart
      ? await prisma.marketplaceCartItem.findUnique({ where: { id: cartItemId } })
      : null;

    if (!item || item.cartId !== cart?.id) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    await prisma.marketplaceCartItem.delete({ where: { id: cartItemId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
