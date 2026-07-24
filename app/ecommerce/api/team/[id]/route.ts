export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { getMemberFromRequest } from '@/ecommerce/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await getMemberFromRequest(request);

    if (!member) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (member.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, email, role, isActive } = body;

    const target = await prisma.teamMember.findUnique({ where: { id } });

    if (!target) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    if (email && email !== target.email) {
      const existing = await prisma.teamMember.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
        ...(isActive !== undefined && { isActive }),
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

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await getMemberFromRequest(request);

    if (!member) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (member.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;

    const target = await prisma.teamMember.findUnique({ where: { id } });

    if (!target) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    const deactivated = await prisma.teamMember.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ data: deactivated });
  } catch (error) {
    console.error('Delete team member error:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
