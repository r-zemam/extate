import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="text-6xl font-bold text-slate-900 mb-4">404</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        </div>

        <p className="text-gray-700 mb-8 leading-relaxed">
          The page you're looking for doesn't exist. This could happen if:
        </p>

        <ul className="text-left bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8 space-y-2 text-sm text-gray-700">
          <li>• The document has been deleted</li>
          <li>• The URL is incorrect or outdated</li>
          <li>• The certificate ID is invalid</li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition text-center"
          >
            Return Home
          </Link>
          <Link
            href="/upload"
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition text-center"
          >
            Upload Document
          </Link>
        </div>

        <p className="text-xs text-gray-600 mt-6 italic">
          If you believe this is an error, please check the URL and try again.
        </p>
      </div>
    </main>
  );
}
