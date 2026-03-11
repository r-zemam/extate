'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for debugging
    console.error('Application error:', error);
    
    // Send error to logging service (optional)
    if (typeof window !== 'undefined') {
      // Could integrate with Sentry, LogRocket, etc.
      const errorLog = {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };
      console.log('Error logged:', errorLog);
    }
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-100">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-red-600 mb-2">Something Went Wrong</h1>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">
          An unexpected error occurred. Our team has been notified and we're working to fix it.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-mono text-red-800 break-words">
            {error.message || 'Unknown error'}
          </p>
          {error.digest && (
            <p className="text-xs text-red-600 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition text-center"
          >
            Return Home
          </Link>
        </div>

        <p className="text-xs text-gray-600 mt-6 italic">
          If the problem persists, please try refreshing the page or using a different browser.
        </p>
      </div>
    </main>
  );
}
