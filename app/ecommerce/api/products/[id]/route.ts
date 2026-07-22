import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: { orderBy: { position: 'asc' } },
        variants: true,
        reviews: {
          include: { customer: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data: any = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.sku !== undefined) data.sku = body.sku;
    if (body.price !== undefined) data.price = parseFloat(body.price);
    if (body.cost !== undefined) data.cost = body.cost ? parseFloat(body.cost) : null;
    if (body.stock !== undefined) data.stock = parseInt(body.stock);
    if (body.lowStockThreshold !== undefined) data.lowStockThreshold = parseInt(body.lowStockThreshold);
    if (body.status !== undefined) data.status = body.status;
    if (body.featured !== undefined) data.featured = body.featured;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId || null;

    const product = await prisma.product.update({
      where: { id: params.id },
      data,
      include: { category: true, images: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
