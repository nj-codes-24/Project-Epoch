"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-md text-center">
        <h2 className="text-display-sm text-primary font-headline mb-4">Something went wrong!</h2>
        <p className="text-body-lg text-on-surface-variant mb-8">
          We encountered an unexpected error. Please try again or head back to the hub.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary text-on-primary font-medium rounded hover:bg-primary-container transition-colors"
          >
            Try again
          </button>
          <Link
            href="/knowledge"
            className="px-6 py-3 bg-surface-dim text-on-surface font-medium rounded hover:bg-outline-variant transition-colors"
          >
            Go to Hub
          </Link>
        </div>
      </div>
    </main>
  );
}
