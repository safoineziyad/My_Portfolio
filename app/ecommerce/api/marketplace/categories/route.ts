import { NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET() {
  try {
    const categories = await prisma.marketplaceCategory.findMany({
      include: {
        _count: {
          select: {
            products: { where: { status: 'active' } },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const data = categories.map((c) => ({
      ...c,
      productCount: c._count.products,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
