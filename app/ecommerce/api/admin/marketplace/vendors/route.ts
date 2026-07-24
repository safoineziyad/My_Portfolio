import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const where: any = {};
    if (status === 'approved') {
      where.isApproved = true;
    } else if (status === 'pending') {
      where.isApproved = false;
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.vendor.count({ where }),
    ]);

    const vendorsWithCount = vendors.map((v) => ({
      ...v,
      productCount: v._count.products,
    }));

    return NextResponse.json({
      data: vendorsWithCount,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, isApproved, isActive, commissionRate } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const data: any = {};
    if (isApproved !== undefined) data.isApproved = isApproved;
    if (isActive !== undefined) data.isActive = isActive;
    if (commissionRate !== undefined) {
      const parsed = parseFloat(commissionRate);
      if (isNaN(parsed) || parsed < 0 || parsed > 100) {
        return NextResponse.json({ error: 'commissionRate must be a number between 0 and 100' }, { status: 400 });
      }
      data.commissionRate = parsed;
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({
      ...vendor,
      productCount: vendor._count.products,
    });
  } catch (error) {
    console.error('Error updating vendor:', error);
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}
