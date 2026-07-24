export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product: any = await prisma.marketplaceProduct.findFirst({
      where: { slug: params.slug },
      include: {
        vendor: {
          select: {
            id: true,
            businessName: true,
            slug: true,
            description: true,
            logo: true,
            rating: true,
            responseTime: true,
            isApproved: true,
          },
        },
        category: { select: { id: true, name: true, slug: true, icon: true } },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
        : 0;

    const relatedProducts = await prisma.marketplaceProduct.findMany({
      where: {
        status: 'active',
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        vendor: { select: { id: true, businessName: true, slug: true, rating: true } },
        _count: { select: { reviews: true } },
      },
      take: 4,
    });

    return NextResponse.json({
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
      relatedProducts,
    });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
