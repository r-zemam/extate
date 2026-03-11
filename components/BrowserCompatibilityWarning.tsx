'use client';

import { useEffect, useState } from 'react';
import { isCryptoSupported } from '@/lib/crypto';

export default function BrowserCompatibilityWarning() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check crypto support on mount
    const supported = isCryptoSupported();
    setIsSupported(supported);

    // Check if user has dismissed the warning
    const dismissed = localStorage.getItem('crypto-warning-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('crypto-warning-dismissed', 'true');
  };

  // Don't show anything if crypto is supported or warning is dismissed
  if (isSupported === null || isSupported || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-b-2 border-red-300 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-1">
              Browser Compatibility Warning
            </h3>
            <p className="text-sm text-red-800 mb-3">
              Your browser does not support the Web Crypto API required for document protection. 
              EXTATE requires a modern browser to function properly.
            </p>
            <div className="text-sm text-red-800 mb-3">
              <p className="font-semibold mb-2">Recommended browsers:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Google Chrome (version 37+)</li>
                <li>Mozilla Firefox (version 34+)</li>
                <li>Apple Safari (version 11+)</li>
                <li>Microsoft Edge (version 79+)</li>
              </ul>
            </div>
            <p className="text-xs text-red-700 italic">
              Please upgrade your browser to use EXTATE. Document protection features will not work in your current browser.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-red-600 hover:text-red-800 transition text-xl"
            aria-label="Dismiss warning"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
