import Link from 'next/link';
import { Calendar, Tag } from 'lucide-react';
import prisma from '@/ecommerce/lib/db';

export const dynamic = 'force-dynamic';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date;
  tags: { name: string }[];
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Blog | Ziyad',
  description: 'Thoughts on web development, programming, and technology.',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-bg">
      <nav className="border-b border-border py-4">
        <div className="mx-auto max-w-4xl px-6 flex items-center justify-between">
          <Link href="/" className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
            Ziyad
          </Link>
          <Link href="/" className="text-sm text-text-main/60 hover:text-primary transition-colors">
            Back to Portfolio
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-text-heading">Blog</h1>
          <p className="mt-3 text-text-main/50">Thoughts on web development and technology</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-main/40 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                  <div className="flex items-center gap-3 text-xs text-text-main/40">
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
                  <h2 className="mt-3 font-heading text-xl font-semibold text-text-heading group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-text-main/50 leading-relaxed">
                    {post.excerpt || 'Read more...'}
                  </p>
                  <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
                    Read article &rarr;
                  </span>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
