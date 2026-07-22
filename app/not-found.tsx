import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <div className="relative">
        <h1 className="text-[10rem] font-bold leading-none text-primary/10">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-4xl text-text-heading">Missing Texture</span>
        </div>
      </div>
      <p className="mt-4 max-w-md text-lg text-text-main/50">
        This page is like a missing texture — it just doesn&apos;t exist. The developers forgot to map it.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-all hover:bg-primary/80"
      >
        Spawn at Home
      </Link>
    </main>
  );
}
