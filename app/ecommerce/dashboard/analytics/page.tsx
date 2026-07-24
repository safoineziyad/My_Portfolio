'use client';
import dynamic from 'next/dynamic';

const AnalyticsPage = dynamic(() => import('./analytics-content'), { ssr: false });

export default function Page() {
  return <AnalyticsPage />;
}
