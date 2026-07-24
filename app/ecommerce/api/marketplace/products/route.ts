export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured');

    const where: any = { status: 'active' };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categorySlug) {
      const category = await prisma.marketplaceCategory.findUnique({ where: { slug: categorySlug } });
      if (category) {
        where.categoryId = category.id;
      }
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      where.featured = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'popular') orderBy = { reviews: { _count: 'desc' } };

    const [data, total] = await Promise.all([
      prisma.marketplaceProduct.findMany({
        where,
        include: {
          vendor: { select: { id: true, businessName: true, slug: true, rating: true, logo: true } },
          category: { select: { id: true, name: true, slug: true, icon: true } },
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.marketplaceProduct.count({ where }),
    ]);

    const productsWithRating = data.map((p) => {
      const avgRating =
        p.reviews && p.reviews.length > 0
          ? p.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / p.reviews.length
          : 0;
      return { ...p, averageRating: Math.round(avgRating * 10) / 10, reviewCount: p._count.reviews };
    });

    return NextResponse.json({
      data: productsWithRating,
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Failed to fetch marketplace products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
