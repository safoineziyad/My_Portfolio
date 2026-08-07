import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'marketplace_token';

export function getMarketplaceUserId(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.split(';').find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const value = match.split('=').slice(1).join('=');
  return value || null;
}

export function setMarketplaceToken(userId: string): string {
  return `${COOKIE_NAME}=${userId}; Path=/; HttpOnly; Max-Age=604800; SameSite=Lax; Secure`;
}

export function clearMarketplaceToken(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`;
}

export function requireMarketplaceUser(request: NextRequest): { userId: string } | { error: NextResponse } {
  const userId = getMarketplaceUserId(request);
  if (!userId) {
    return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) };
  }
  return { userId };
}
