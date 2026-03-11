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

export default function CertificatePage({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastPdfError, setLastPdfError] = useState<string | null>(null);

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

  const handleRetryPdfDownload = () => {
    handleDownloadPDF();
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading certificate...</p>
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
            className="inline-block px-6 py-2 bg-certificate-deep-blue text-white rounded hover:bg-opacity-90 transition"
          >
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  // Get dynamic property address label
  const propertyAddressLabel = getPropertyAddressLabel(document.document_type);

  return (
    <main className="min-h-screen bg-gradient-to-b from-certificate-cream to-certificate-off-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Certificate Container */}
        <div className="bg-certificate-off-white shadow-2xl rounded-lg overflow-hidden border-8 border-certificate-gold">
          {/* Decorative Top Border */}
          <div className="h-2 bg-gradient-to-r from-certificate-deep-blue via-certificate-gold to-certificate-deep-blue"></div>

          {/* Certificate Content */}
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

            {/* Owner Information Section */}
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

            {/* Document Details Section */}
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
              <h2 className="font-serif text-lg font-bold text-certificate-deep-blue mb-4 uppercase tracking-wide">
                Document Fingerprint (SHA-256)
              </h2>
              <div className="bg-certificate-dark-text text-certificate-gold p-4 rounded font-mono text-xs sm:text-sm break-all leading-relaxed">
                {document.fingerprint}
              </div>
              <p className="text-xs text-gray-600 mt-3 italic">
                This unique fingerprint proves the authenticity and integrity of the registered document.
              </p>
            </div>

            {/* Registration Details Section */}
            <div className="mb-8 p-4 bg-certificate-cream rounded border-l-4 border-certificate-bronze">
              <h3 className="font-serif text-sm font-bold text-certificate-deep-blue uppercase tracking-wide mb-2">
                Registration Details
              </h3>
              <p className="font-serif text-sm text-certificate-dark-text">
                <span className="font-semibold">Registered:</span> {formatTimestamp(document.created_at)}
              </p>
              <p className="font-serif text-sm text-certificate-dark-text mt-1">
                <span className="font-semibold">Certificate ID:</span> {document.id}
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

          {/* Decorative Bottom Border */}
          <div className="h-2 bg-gradient-to-r from-certificate-deep-blue via-certificate-gold to-certificate-deep-blue"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-6 py-3 bg-certificate-deep-blue text-white font-semibold rounded hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
          {lastPdfError && (
            <button
              onClick={handleRetryPdfDownload}
              disabled={isDownloading}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Retry PDF Download
            </button>
          )}
          <Link
            href={`/verify/${document.id}`}
            className="px-6 py-3 bg-certificate-forest-green text-white font-semibold rounded hover:bg-opacity-90 transition text-center"
          >
            Verify This Document
          </Link>
        </div>

        {/* Print Friendly Note */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>💡 Tip: You can also print this certificate directly from your browser (Ctrl+P or Cmd+P)</p>
        </div>
      </div>
    </main>
  );
}
