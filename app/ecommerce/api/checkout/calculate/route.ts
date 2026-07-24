import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { calculateCheckout, type VatCategory } from '@/ecommerce/lib/tax';

/**
 * POST /api/checkout/calculate
 *
 * Accepts: { "items": [{"product_id": "xxx", "qty": 2}] }
 * Returns: Full VAT breakdown per Moroccan tax law (2026).
 *
 * Only VAT is charged to the customer — no other taxes appear on the invoice.
 * Each OrderItem stores vatRateApplied and vatAmount for DGI audit compliance.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'items array is required and must not be empty' },
        { status: 400 },
      );
    }

    for (const item of items) {
      if (!item.product_id || !item.qty || item.qty < 1) {
        return NextResponse.json(
          { error: 'Each item must have product_id and qty >= 1' },
          { status: 400 },
        );
      }
    }

    // Fetch all referenced products in one query
    const productIds = items.map((i: { product_id: string }) => i.product_id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'active' },
      select: {
        id: true,
        name: true,
        price: true,
        vatCategory: true,
      },
    });

    // Build lookup map
    const productLookup = new Map(
      products.map((p) => [
        p.id,
        {
          id: p.id,
          name: p.name,
          base_price_excluding_tax: p.price,
          vat_category: (p.vatCategory as VatCategory) || 'standard',
        },
      ]),
    );

    const result = calculateCheckout(items, productLookup);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Checkout calculation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate checkout' },
      { status: 400 },
    );
  }
}
