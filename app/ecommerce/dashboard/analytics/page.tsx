'use client';
import dynamic from 'next/dynamic';

const AnalyticsPage = dynamic(() => import('./analytics-content'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-3" />
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

export default function Page() {
  return <AnalyticsPage />;
}
