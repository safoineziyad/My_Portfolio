'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-6 text-center">
      <div className="max-w-md">
        <div className="mb-6 text-6xl font-bold text-red-500">!</div>
        <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
        <p className="mt-3 text-gray-400">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
