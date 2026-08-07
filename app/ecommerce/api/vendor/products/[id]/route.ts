export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { requireVendor } from '@/ecommerce/lib/api-auth';

async function verifyOwnership(id: string, vendorId: string): Promise<NextResponse | null> {
  const product = await prisma.marketplaceProduct.findUnique({ where: { id } });
  if (!product || product.vendorId !== vendorId) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return null;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireVendor(request);
    if ('error' in auth) return auth.error;
    const vendorId = auth.vendorId;
    const { id } = params;

    const ownershipError = await verifyOwnership(id, vendorId);
    if (ownershipError) return ownershipError;

    const body = await request.json();
    const { name, description, price, compareAtPrice, stock, sku, status, categoryId } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description || null;
    if (price !== undefined) data.price = parseFloat(price);
    if (compareAtPrice !== undefined) data.compareAtPrice = compareAtPrice ? parseFloat(compareAtPrice) : null;
    if (stock !== undefined) data.stock = parseInt(stock);
    if (sku !== undefined) data.sku = sku || null;
    if (status !== undefined) data.status = status;
    if (categoryId !== undefined) data.categoryId = categoryId || null;

    if (name) {
      data.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    }

    const product = await prisma.marketplaceProduct.update({
      where: { id },
      data,
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireVendor(request);
    if ('error' in auth) return auth.error;
    const vendorId = auth.vendorId;
    const { id } = params;

    const ownershipError = await verifyOwnership(id, vendorId);
    if (ownershipError) return ownershipError;

    await prisma.marketplaceProduct.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
