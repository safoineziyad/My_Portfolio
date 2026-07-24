export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { hashPassword } from '@/ecommerce/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, businessName, description, taxId, businessAddress, phone } =
      await request.json();

    if (!name || !email || !password || !businessName) {
      return NextResponse.json({ error: 'Name, email, password, and business name are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        role: 'seller',
        phone: phone || null,
      },
    });

    const vendor = await prisma.vendor.create({
      data: {
        userId: user.id,
        businessName,
        slug: slug + '-' + Date.now().toString(36),
        description: description || null,
        taxId: taxId || null,
        businessAddress: businessAddress || null,
        phone: phone || null,
        email,
      },
    });

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      vendor: { id: vendor.id, businessName: vendor.businessName, slug: vendor.slug },
    }, { status: 201 });
  } catch (error) {
    console.error('Seller registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
