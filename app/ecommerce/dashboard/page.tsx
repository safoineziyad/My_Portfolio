'use client';
import dynamic from 'next/dynamic';

const DashboardPage = dynamic(() => import('@/ecommerce/components/DashboardPage').then(mod => ({ default: mod.DashboardPage })), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-3" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32 mb-3" />
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  ),
});

export default function Page() {
  return <DashboardPage />;
}
