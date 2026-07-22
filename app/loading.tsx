export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
        <p className="font-mono text-sm text-text-main/30">Loading...</p>
      </div>
    </main>
  );
}
