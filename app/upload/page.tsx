'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { computeSHA256, CryptoNotSupportedError, HashComputationError } from '@/lib/crypto';
import { validateUploadForm, FormValidationResult } from '@/lib/validation';
import { uploadDocument } from '@/lib/actions';
import { getPropertyAddressLabel } from '@/lib/formatting';

interface FormState {
  file: File | null;
  ownerName: string;
  propertyAddress: string;
  documentType: string;
  documentDate: string;
  isSubmitting: boolean;
  error: string | null;
  validationErrors: FormValidationResult['errors'];
  lastError?: {
    message: string;
    timestamp: number;
    type: 'hash' | 'upload' | 'validation';
  };
}

export default function UploadPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    file: null,
    ownerName: '',
    propertyAddress: '',
    documentType: '',
    documentDate: '',
    isSubmitting: false,
    error: null,
    validationErrors: {},
    lastError: undefined,
  });

  // Get dynamic property address label based on document type
  const propertyAddressLabel = getPropertyAddressLabel(formState.documentType || '');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormState(prev => ({
      ...prev,
      file,
      validationErrors: { ...prev.validationErrors, file: undefined },
      error: null,
    }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Omit<FormState, 'file' | 'isSubmitting' | 'error' | 'validationErrors'>
  ) => {
    const value = e.target.value;
    setFormState(prev => ({
      ...prev,
      [field]: value,
      validationErrors: { ...prev.validationErrors, [field]: undefined },
      error: null,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const validationResult = validateUploadForm({
      file: formState.file,
      ownerName: formState.ownerName,
      propertyAddress: formState.propertyAddress,
      documentType: formState.documentType,
      documentDate: formState.documentDate,
    });

    if (!validationResult.isValid) {
      setFormState(prev => ({
        ...prev,
        validationErrors: validationResult.errors,
      }));
      return;
    }

    // Clear previous errors
    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null,
      validationErrors: {},
    }));

    try {
      // Compute SHA-256 hash
      if (!formState.file) {
        throw new Error('File is required.');
      }

      const fingerprint = await computeSHA256(formState.file);

      // Create FormData for server action
      const uploadFormData = new FormData();
      uploadFormData.append('file', formState.file);
      uploadFormData.append('ownerName', formState.ownerName);
      uploadFormData.append('propertyAddress', formState.propertyAddress);
      uploadFormData.append('documentType', formState.documentType);
      uploadFormData.append('documentDate', formState.documentDate);

      // Call server action
      const result = await uploadDocument(uploadFormData, fingerprint);

      // Redirect to certificate page
      router.push(`/certificate/${result.id}`);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      let errorType: 'hash' | 'upload' | 'validation' = 'upload';

      if (error instanceof CryptoNotSupportedError) {
        errorMessage = 'Your browser does not support the required cryptographic features. Please use a modern browser like Chrome, Firefox, Safari, or Edge.';
        errorType = 'hash';
      } else if (error instanceof HashComputationError) {
        errorMessage = 'Failed to process your file. Please try again.';
        errorType = 'hash';
      } else if (error instanceof Error) {
        errorMessage = error.message;
        errorType = 'upload';
      }

      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        error: errorMessage,
        lastError: {
          message: errorMessage,
          timestamp: Date.now(),
          type: errorType,
        },
      }));
    }
  };

  const handleRetry = () => {
    setFormState(prev => ({
      ...prev,
      error: null,
      lastError: undefined,
    }));
    handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLFormElement>);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Protect Your Document</h1>
          <p className="text-gray-600 mb-8">
            Upload your property document to create a tamper-evident certificate of registration.
          </p>

          {formState.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 mb-4">{formState.error}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleRetry}
                  disabled={formState.isSubmitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded transition"
                >
                  {formState.isSubmitting ? 'Retrying...' : 'Retry'}
                </button>
                <button
                  onClick={() => setFormState(prev => ({ ...prev, error: null, lastError: undefined }))}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Input Section */}
            <div className="border-l-4 border-blue-600 pl-6 py-2">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Document File *
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                formState.validationErrors.file
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  disabled={formState.isSubmitting}
                  className="hidden"
                />
                <label htmlFor="file" className="cursor-pointer">
                  <div className="text-gray-600">
                    {formState.file ? (
                      <div>
                        <p className="font-medium text-gray-900">{formState.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(formState.file.size / 1024 / 1024).toFixed(2)} MB
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
              {formState.validationErrors.file && (
                <p className="mt-2 text-sm text-red-600">{formState.validationErrors.file}</p>
              )}
            </div>

            {/* Owner Information Section */}
            <div className="border-l-4 border-blue-600 pl-6 py-2">
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name *
              </label>
              <input
                id="ownerName"
                type="text"
                value={formState.ownerName}
                onChange={(e) => handleInputChange(e, 'ownerName')}
                disabled={formState.isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  formState.validationErrors.ownerName
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Enter property owner's full name"
              />
              {formState.validationErrors.ownerName && (
                <p className="mt-2 text-sm text-red-600">{formState.validationErrors.ownerName}</p>
              )}
            </div>

            {/* Property Details Section */}
            <div className="border-l-4 border-blue-600 pl-6 py-2 space-y-4">
              {/* Property Address with dynamic label */}
              <div>
                <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  {propertyAddressLabel} *
                </label>
                <input
                  id="propertyAddress"
                  type="text"
                  value={formState.propertyAddress}
                  onChange={(e) => handleInputChange(e, 'propertyAddress')}
                  disabled={formState.isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    formState.validationErrors.propertyAddress
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder={`Enter the ${propertyAddressLabel.toLowerCase()}`}
                />
                {formState.validationErrors.propertyAddress && (
                  <p className="mt-2 text-sm text-red-600">{formState.validationErrors.propertyAddress}</p>
                )}
              </div>

              {/* Document Type */}
              <div>
                <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  id="documentType"
                  value={formState.documentType}
                  onChange={(e) => handleInputChange(e, 'documentType')}
                  disabled={formState.isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    formState.validationErrors.documentType
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a document type</option>
                  <option value="deed">Deed</option>
                  <option value="title">Title</option>
                  <option value="inheritance_record">Inheritance Record</option>
                  <option value="tax_document">Tax Document</option>
                </select>
                {formState.validationErrors.documentType && (
                  <p className="mt-2 text-sm text-amber-700">{formState.validationErrors.documentType}</p>
                )}
              </div>

              {/* Document Date */}
              <div>
                <label htmlFor="documentDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Document Date *
                </label>
                <input
                  id="documentDate"
                  type="date"
                  value={formState.documentDate}
                  onChange={(e) => handleInputChange(e, 'documentDate')}
                  disabled={formState.isSubmitting}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    formState.validationErrors.documentDate
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {formState.validationErrors.documentDate && (
                  <p className="mt-2 text-sm text-red-600">{formState.validationErrors.documentDate}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {formState.isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Register Document'
                )}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            * Required fields. Your document will be hashed in your browser and stored securely.
          </p>
        </div>
      </div>
    </main>
  );
}
