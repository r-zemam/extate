'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDocument } from '@/lib/actions';
import { computeSHA256, CryptoNotSupportedError, HashComputationError } from '@/lib/crypto';

interface DocumentRecord {
  id: string;
  owner_name: string;
  property_address: string;
  document_type: string;
  document_date: string;
  fingerprint: string;
  file_url: string;
  created_at: string;
}

interface VerificationState {
  storedFingerprint: string;
  uploadedFile: File | null;
  computedFingerprint: string | null;
  isVerifying: boolean;
  verificationResult: 'match' | 'mismatch' | null;
  lastVerificationError?: string;
}

export default function VerifyPage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationState, setVerificationState] = useState<VerificationState>({
    storedFingerprint: '',
    uploadedFile: null,
    computedFingerprint: null,
    isVerifying: false,
    verificationResult: null,
  });

  useEffect(() => {
    async function fetchDocument() {
      try {
        const data = await getDocument(params.id);
        setDocument(data);
        setVerificationState(prev => ({
          ...prev,
          storedFingerprint: data.fingerprint,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [params.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVerificationState(prev => ({
      ...prev,
      uploadedFile: file,
      computedFingerprint: null,
      verificationResult: null,
    }));
  };

  const handleVerify = async () => {
    if (!verificationState.uploadedFile) {
      setError('Please select a file to verify');
      return;
    }

    setError(null);
    setVerificationState(prev => ({
      ...prev,
      isVerifying: true,
      lastVerificationError: undefined,
    }));

    try {
      const computedHash = await computeSHA256(verificationState.uploadedFile);
      const isMatch = computedHash === verificationState.storedFingerprint;

      setVerificationState(prev => ({
        ...prev,
        computedFingerprint: computedHash,
        verificationResult: isMatch ? 'match' : 'mismatch',
        isVerifying: false,
      }));
    } catch (err) {
      let errorMessage = 'Failed to verify file. Please try again.';

      if (err instanceof CryptoNotSupportedError) {
        errorMessage = 'Your browser does not support the required cryptographic features. Please use a modern browser like Chrome, Firefox, Safari, or Edge.';
      } else if (err instanceof HashComputationError) {
        errorMessage = 'Failed to compute file hash. Please try again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setVerificationState(prev => ({
        ...prev,
        isVerifying: false,
        lastVerificationError: errorMessage,
      }));
    }
  };

  const handleRetryVerification = () => {
    handleVerify();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading verification page...</p>
        </div>
      </main>
    );
  }

  if (error && !document) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Document Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The document you are looking for does not exist.'}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  if (!document) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Document Not Found</h1>
          <p className="text-gray-600 mb-6">The document you are looking for does not exist.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Document</h1>
          <p className="text-gray-600 mb-8">
            Upload the document to verify it matches the registered fingerprint.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Document Information Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Owner Name</p>
                <p className="text-base text-gray-900">{document.owner_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Property Address</p>
                <p className="text-base text-gray-900">{document.property_address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Document Type</p>
                <p className="text-base text-gray-900 capitalize">{document.document_type.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Document Date</p>
                <p className="text-base text-gray-900">{document.document_date}</p>
              </div>
            </div>
          </div>

          {/* Stored Fingerprint Section */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stored Fingerprint (SHA-256)</h2>
            <div className="bg-gray-900 text-blue-400 p-4 rounded font-mono text-xs sm:text-sm break-all leading-relaxed">
              {verificationState.storedFingerprint}
            </div>
            <p className="text-xs text-gray-600 mt-3 italic">
              This is the fingerprint stored when the document was registered.
            </p>
          </div>

          {/* File Upload Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Document to Verify</h2>
            <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
              verificationState.uploadedFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                id="verify-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={verificationState.isVerifying}
                className="hidden"
              />
              <label htmlFor="verify-file" className="cursor-pointer">
                <div className="text-gray-600">
                  {verificationState.uploadedFile ? (
                    <div>
                      <p className="font-medium text-gray-900">✓ {verificationState.uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(verificationState.uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm">PDF, JPG, or PNG (max 10MB)</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Verify Button */}
          <div className="mb-8">
            <button
              onClick={handleVerify}
              disabled={!verificationState.uploadedFile || verificationState.isVerifying}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {verificationState.isVerifying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'Verify Document'
              )}
            </button>
            {verificationState.lastVerificationError && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleRetryVerification}
                  disabled={verificationState.isVerifying}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded transition"
                >
                  {verificationState.isVerifying ? 'Retrying...' : 'Retry Verification'}
                </button>
                <button
                  onClick={() => setVerificationState(prev => ({ ...prev, lastVerificationError: undefined }))}
                  className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded transition"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Verification Result Section */}
          {verificationState.verificationResult && (
            <div className={`mb-8 p-6 rounded-lg border-2 ${
              verificationState.verificationResult === 'match'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 text-3xl ${
                  verificationState.verificationResult === 'match'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {verificationState.verificationResult === 'match' ? '✓' : '✕'}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    verificationState.verificationResult === 'match'
                      ? 'text-green-900'
                      : 'text-red-900'
                  }`}>
                    {verificationState.verificationResult === 'match'
                      ? 'Document Verified ✓'
                      : 'Document Mismatch ✕'}
                  </h3>
                  <p className={`text-sm mb-4 ${
                    verificationState.verificationResult === 'match'
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}>
                    {verificationState.verificationResult === 'match'
                      ? 'The uploaded document matches the registered fingerprint. This document has not been altered.'
                      : 'The uploaded document does not match the registered fingerprint. This document may have been altered or is not the original registered document.'}
                  </p>

                  {/* Fingerprint Comparison */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">STORED FINGERPRINT</p>
                      <div className="bg-gray-900 text-gray-300 p-3 rounded font-mono text-xs break-all leading-relaxed">
                        {verificationState.storedFingerprint}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">COMPUTED FINGERPRINT</p>
                      <div className={`p-3 rounded font-mono text-xs break-all leading-relaxed ${
                        verificationState.verificationResult === 'match'
                          ? 'bg-gray-900 text-green-400'
                          : 'bg-gray-900 text-red-400'
                      }`}>
                        {verificationState.computedFingerprint}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/certificate/${document.id}`}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 transition text-center"
            >
              View Certificate
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500 transition text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
