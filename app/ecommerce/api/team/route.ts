import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { getMemberFromRequest, hashPassword } from '@/ecommerce/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const member = await getMemberFromRequest(request);

    if (!member) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const members = await prisma.teamMember.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: members });
  } catch (error) {
    console.error('Fetch team members error:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const member = await getMemberFromRequest(request);

    if (!member) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (member.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await prisma.teamMember.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const newMember = await prisma.teamMember.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'member',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ data: newMember }, { status: 201 });
  } catch (error) {
    console.error('Create team member error:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
