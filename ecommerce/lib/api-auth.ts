import { NextRequest, NextResponse } from 'next/server';
import { getMemberFromRequest } from '@/ecommerce/lib/auth';
import { getMarketplaceUserId } from '@/ecommerce/lib/marketplace-auth';
import prisma from '@/ecommerce/lib/db';

export async function requireAdmin(request: NextRequest) {
  const member = await getMemberFromRequest(request);
  if (!member) {
    return { error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) };
  }
  if (member.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) };
  }
  return { member };
}

export async function requireVendor(request: NextRequest) {
  const userId = getMarketplaceUserId(request);
  if (!userId) {
    return { error: NextResponse.json({ error: 'Not authenticated' }, { status: 401 }) };
  }
  const vendor = await prisma.vendor.findUnique({ where: { userId } });
  if (!vendor) {
    return { error: NextResponse.json({ error: 'Vendor account required' }, { status: 403 }) };
  }
  if (!vendor.isApproved || !vendor.isActive) {
    return { error: NextResponse.json({ error: 'Vendor account is not active' }, { status: 403 }) };
  }
  return { vendorId: vendor.id };
}
