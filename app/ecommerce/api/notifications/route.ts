export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const formatted = notifications.map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      time: n.createdAt.toISOString(),
      read: n.read,
      type: n.type,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const notification = await prisma.notification.create({
      data: {
        title: body.title,
        message: body.message,
        type: body.type || 'system',
      },
    });
    return NextResponse.json(notification);
  } catch (error) {
    console.error('Failed to create notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
