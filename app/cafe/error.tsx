'use client';

import { useEffect } from 'react';

export default function CafeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Cafe error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf6f1] px-6 text-center">
      <div className="max-w-md">
        <div className="mb-6 text-6xl font-bold text-amber-600">!</div>
        <h2 className="font-playfair text-2xl font-bold text-gray-900">
          Something went wrong
        </h2>
        <p className="mt-3 font-poppins text-gray-500">
          We encountered an issue loading this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-amber-600 px-6 py-3 font-poppins font-semibold text-white transition-colors hover:bg-amber-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
