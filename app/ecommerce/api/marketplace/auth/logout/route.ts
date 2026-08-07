export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { clearMarketplaceToken } from '@/ecommerce/lib/marketplace-auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', clearMarketplaceToken());
  return response;
}
