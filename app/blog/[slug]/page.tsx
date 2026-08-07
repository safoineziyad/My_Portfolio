import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import prisma from '@/ecommerce/lib/db';

export const dynamic = 'force-dynamic';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  tags: { name: string }[];
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
      include: { tags: true },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Ziyad`,
    description: post.excerpt || post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border py-4">
        <div className="mx-auto max-w-3xl px-6 flex items-center justify-between">
          <Link href="/" className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
            Ziyad
          </Link>
          <Link href="/blog" className="flex items-center gap-1 text-sm text-text-main/60 hover:text-primary transition-colors">
            <ArrowLeft size={14} />
            All Posts
          </Link>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-8">
          <div className="flex items-center gap-3 text-xs text-text-main/40 mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
            {post.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag size={12} />
                {post.tags.map((t) => t.name).join(', ')}
              </span>
            )}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-heading leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg text-text-main/60">{post.excerpt}</p>
          )}
        </header>

        {post.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-border">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto"
              unoptimized
            />
          </div>
        )}

        <div className="prose prose-invert prose-primary max-w-none">
          <div className="text-text-main/70 leading-relaxed whitespace-pre-wrap text-sm">
            {post.content}
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-border">
          <Link href="/blog" className="text-sm text-primary hover:underline">
            &larr; Back to all posts
          </Link>
        </footer>
      </article>
    </div>
  );
}
