export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { requireMarketplaceUser } from '@/ecommerce/lib/marketplace-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    const reviews = await prisma.marketplaceReview.findMany({
      where: { productId, status: 'approved' },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireMarketplaceUser(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;
    const { productId, rating, comment } = await request.json();

    if (!productId || !rating) {
      return NextResponse.json({ error: 'productId and rating are required' }, { status: 400 });
    }

    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 });
    }

    const purchased = await prisma.marketplaceOrder.findFirst({
      where: { userId, status: { not: 'cancelled' }, items: { some: { productId } } },
    });
    if (!purchased) {
      return NextResponse.json({ error: 'You can only review products you have purchased' }, { status: 403 });
    }

    const review = await prisma.marketplaceReview.create({
      data: {
        userId,
        productId,
        rating: parsedRating,
        comment: comment || null,
        status: 'approved',
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
