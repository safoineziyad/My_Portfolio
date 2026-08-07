import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/ecommerce/lib/db';
import { requireAdmin } from '@/ecommerce/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: { tags: true },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;
    const body = await request.json();
    const { title, content, excerpt, coverImage, published, tags } = body;

    const existing = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let newSlug = existing.slug;
    if (title && title !== existing.title) {
      newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const slugExists = await prisma.blogPost.findFirst({
        where: { slug: newSlug, id: { not: existing.id } },
      });
      if (slugExists) newSlug = `${newSlug}-${Date.now()}`;
    }

    const post = await prisma.blogPost.update({
      where: { id: existing.id },
      data: {
        ...(title && { title, slug: newSlug }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(coverImage !== undefined && { coverImage }),
        ...(published !== undefined && { published }),
        ...(tags && {
          tags: {
            set: [],
            connectOrCreate: tags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
      },
      include: { tags: true },
    });

    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = await requireAdmin(request);
    if ('error' in auth) return auth.error;
    const existing = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.blogPost.delete({ where: { id: existing.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
