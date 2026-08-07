import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { requireAdmin } from '@/ecommerce/lib/api-auth';

export const dynamic = 'force-dynamic';

const STORE_ID = 'store_main';

export async function GET() {
  try {
    const [store, settings] = await Promise.all([
      prisma.store.findUnique({ where: { id: STORE_ID } }),
      prisma.setting.findUnique({ where: { storeId: STORE_ID } }),
    ]);
    return NextResponse.json({
      storeName: store?.name || 'Ziyad Store',
      storeEmail: store?.email || '',
      currency: store?.currency || 'USD',
      timezone: store?.timezone || 'America/New_York',
      taxRate: settings ? String(settings.taxRate * 100) : '8',
      shippingRate: settings ? String(settings.shippingRate) : '5.99',
      lowStockEmail: settings?.lowStockEmail ?? true,
      orderConfirmationEmail: settings?.orderConfirmationEmail ?? true,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;
    const body = await request.json();
    const taxRate = parseFloat(body.taxRate);
    const shippingRate = parseFloat(body.shippingRate);

    await prisma.store.upsert({
      where: { id: STORE_ID },
      create: {
        id: STORE_ID,
        name: body.storeName || 'Ziyad Store',
        slug: 'ziyad-store',
        currency: body.currency || 'USD',
        timezone: body.timezone || 'America/New_York',
        email: body.storeEmail || null,
      },
      update: {
        name: body.storeName || 'Ziyad Store',
        currency: body.currency || 'USD',
        timezone: body.timezone || 'America/New_York',
        email: body.storeEmail || null,
      },
    });

    await prisma.setting.upsert({
      where: { storeId: STORE_ID },
      create: {
        storeId: STORE_ID,
        taxRate: Number.isFinite(taxRate) ? taxRate / 100 : 0.08,
        shippingRate: Number.isFinite(shippingRate) ? shippingRate : 5.99,
        lowStockEmail: !!body.lowStockEmail,
        orderConfirmationEmail: !!body.orderConfirmationEmail,
      },
      update: {
        taxRate: Number.isFinite(taxRate) ? taxRate / 100 : 0.08,
        shippingRate: Number.isFinite(shippingRate) ? shippingRate : 5.99,
        lowStockEmail: !!body.lowStockEmail,
        orderConfirmationEmail: !!body.orderConfirmationEmail,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
