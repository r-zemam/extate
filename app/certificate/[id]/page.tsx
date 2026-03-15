'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDocument } from '@/lib/actions';
import { generateCertificatePDF } from '@/lib/pdf-generator';
import { formatDate, formatTimestamp, getPropertyAddressLabel } from '@/lib/formatting';

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

/**
 * Format a UUID into a readable certificate ID like EXTATE-A1B2-C3D4
 */
function formatCertificateId(id: string): string {
  const clean = id.replace(/-/g, '').toUpperCase();
  return `EXTATE-${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
}

export default function CertificatePage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastPdfError, setLastPdfError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const data = await getDocument(params.id);
        setDocument(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load certificate');
      } finally {
        setLoading(false);
      }
    }
    fetchDocument();
  }, [params.id]);

  const handleDownloadPDF = async () => {
    if (!document) return;
    try {
      setIsDownloading(true);
      setLastPdfError(null);
      generateCertificatePDF(document);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate PDF';
      setLastPdfError(errorMsg);
      setError(errorMsg);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyFingerprint = async () => {
    if (!document) return;
    try {
      await navigator.clipboard.writeText(document.fingerprint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available — silently ignore
    }
  };

  const handleShare = async () => {
    if (!document) return;
    const verifyUrl = `${window.location.origin}/verify/${document.id}`;
    if (navigator.share) {
      await navigator.share({ title: 'EXTATE Certificate', url: verifyUrl });
    } else {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your certificate...</p>
        </div>
      </main>
    );
  }

  if (error || !document) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Certificate Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The certificate you are looking for does not exist.'}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-certificate-deep-blue text-white rounded-lg hover:bg-opacity-90 transition"
          >
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  const propertyAddressLabel = getPropertyAddressLabel(document.document_type);
  const certId = formatCertificateId(document.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-certificate-cream to-certificate-off-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Certificate Container */}
        <div className="bg-certificate-off-white shadow-2xl rounded-lg overflow-hidden border-8 border-certificate-gold">
          {/* Decorative Top Border */}
          <div className="h-2 bg-gradient-to-r from-certificate-deep-blue via-certificate-gold to-certificate-deep-blue"></div>

          <div className="p-8 sm:p-12 lg:p-16">
            {/* Official Seal */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-certificate-gold bg-certificate-deep-blue flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-certificate-gold text-3xl font-bold">✓</div>
                  <div className="text-certificate-gold text-xs font-semibold mt-1">EXTATE</div>
                </div>
              </div>
            </div>

            {/* Header */}
            <h1 className="text-center font-serif text-3xl sm:text-4xl font-bold text-certificate-deep-blue mb-2 tracking-wide">
              CERTIFICATE OF DOCUMENT REGISTRATION
            </h1>
            <div className="h-1 w-24 bg-certificate-gold mx-auto mb-8"></div>

            {/* Declaration */}
            <p className="text-center font-serif text-base sm:text-lg text-certificate-dark-text mb-8 leading-relaxed italic">
              This certifies that the following property document has been registered and protected with cryptographic verification.
            </p>

            {/* Owner Information */}
            <div className="mb-8 p-6 bg-certificate-cream rounded border-l-4 border-certificate-gold">
              <h2 className="font-serif text-lg font-bold text-certificate-deep-blue mb-4 uppercase tracking-wide">
                Property Owner
              </h2>
              <p className="font-serif text-xl text-certificate-dark-text font-semibold mb-2">
                {document.owner_name}
              </p>
              <div className="mt-4">
                <h3 className="font-serif text-sm font-bold text-certificate-deep-blue uppercase tracking-wide mb-2">
                  {propertyAddressLabel}
                </h3>
                <p className="font-serif text-base text-certificate-dark-text">
                  {document.property_address}
                </p>
              </div>
            </div>

            {/* Document Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-certificate-cream rounded">
                <h3 className="font-serif text-sm font-bold text-certificate-deep-blue uppercase tracking-wide mb-2">
                  Document Type
                </h3>
                <p className="font-serif text-base text-certificate-dark-text capitalize">
                  {document.document_type.replace(/_/g, ' ')}
                </p>
              </div>
              <div className="p-4 bg-certificate-cream rounded">
                <h3 className="font-serif text-sm font-bold text-certificate-deep-blue uppercase tracking-wide mb-2">
                  Document Date
                </h3>
                <p className="font-serif text-base text-certificate-dark-text">
                  {formatDate(document.document_date)}
                </p>
              </div>
            </div>

            {/* Fingerprint Section */}
            <div className="mb-8 p-6 bg-white border-2 border-certificate-gold rounded">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg font-bold text-certificate-deep-blue uppercase tracking-wide">
                  Document Fingerprint (SHA-256)
                </h2>
                <button
                  onClick={handleCopyFingerprint}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-certificate-deep-blue text-white rounded hover:bg-opacity-90 transition"
                  title="Copy fingerprint"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-certificate-dark-text text-certificate-gold p-4 rounded font-mono text-xs sm:text-sm break-all leading-relaxed">
                {document.fingerprint}
              </div>
              <p className="text-xs text-gray-600 mt-3 italic">
                This unique fingerprint proves the authenticity and integrity of the registered document.
              </p>
            </div>

            {/* Registration Details */}
            <div className="mb-8 p-4 bg-certificate-cream rounded border-l-4 border-certificate-bronze">
              <h3 className="font-serif text-sm font-bold text-certificate-deep-blue uppercase tracking-wide mb-3">
                Registration Details
              </h3>
              <p className="font-serif text-sm text-certificate-dark-text">
                <span className="font-semibold">Registered:</span> {formatTimestamp(document.created_at)}
              </p>
              <p className="font-serif text-sm text-certificate-dark-text mt-2">
                <span className="font-semibold">Certificate ID:</span>{' '}
                <span className="font-mono tracking-widest text-certificate-deep-blue font-bold">{certId}</span>
              </p>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t-2 border-certificate-gold">
              <p className="font-serif text-xs text-gray-600 italic">
                This certificate serves as official proof of document registration and protection.
                <br />
                Verify the authenticity of this document at any time using the verification page.
              </p>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-certificate-deep-blue via-certificate-gold to-certificate-deep-blue"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-6 py-3 bg-certificate-deep-blue text-white font-semibold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>

          <button
            onClick={handleShare}
            className="px-6 py-3 bg-white border-2 border-certificate-deep-blue text-certificate-deep-blue font-semibold rounded-lg hover:bg-certificate-cream transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Verify Link
          </button>

          {lastPdfError && (
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              Retry PDF Download
            </button>
          )}

          <Link
            href={`/verify/${document.id}`}
            className="px-6 py-3 bg-certificate-forest-green text-white font-semibold rounded-lg hover:bg-opacity-90 transition text-center flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verify This Document
          </Link>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>You can also print this certificate from your browser — Ctrl+P or Cmd+P</p>
        </div>
      </div>
    </main>
  );
}
