'use client';

import { useState, FormEvent, ChangeEvent, DragEvent } from 'react';
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
  submitStep: 'idle' | 'hashing' | 'uploading' | 'registering';
  error: string | null;
  validationErrors: FormValidationResult['errors'];
  lastError?: {
    message: string;
    timestamp: number;
    type: 'hash' | 'upload' | 'validation';
  };
}

/**
 * Document upload page
 *
 * Handles file selection (click or drag-and-drop), form validation,
 * client-side SHA-256 hashing, and document registration via server action.
 * Redirects to the certificate page on success.
 */
export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    file: null,
    ownerName: '',
    propertyAddress: '',
    documentType: '',
    documentDate: '',
    isSubmitting: false,
    submitStep: 'idle',
    error: null,
    validationErrors: {},
    lastError: undefined,
  });

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

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setFormState(prev => ({
        ...prev,
        file,
        validationErrors: { ...prev.validationErrors, file: undefined },
        error: null,
      }));
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Omit<FormState, 'file' | 'isSubmitting' | 'submitStep' | 'error' | 'validationErrors'>
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

    const validationResult = validateUploadForm({
      file: formState.file,
      ownerName: formState.ownerName,
      propertyAddress: formState.propertyAddress,
      documentType: formState.documentType,
      documentDate: formState.documentDate,
    });

    if (!validationResult.isValid) {
      setFormState(prev => ({ ...prev, validationErrors: validationResult.errors }));
      return;
    }

    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      submitStep: 'hashing',
      error: null,
      validationErrors: {},
    }));

    try {
      if (!formState.file) throw new Error('File is required.');

      const fingerprint = await computeSHA256(formState.file);

      setFormState(prev => ({ ...prev, submitStep: 'uploading' }));

      const uploadFormData = new FormData();
      uploadFormData.append('file', formState.file);
      uploadFormData.append('ownerName', formState.ownerName);
      uploadFormData.append('propertyAddress', formState.propertyAddress);
      uploadFormData.append('documentType', formState.documentType);
      uploadFormData.append('documentDate', formState.documentDate);

      setFormState(prev => ({ ...prev, submitStep: 'registering' }));

      const result = await uploadDocument(uploadFormData, fingerprint);

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
        submitStep: 'idle',
        error: errorMessage,
        lastError: { message: errorMessage, timestamp: Date.now(), type: errorType },
      }));
    }
  };

  const handleRetry = () => {
    setFormState(prev => ({ ...prev, error: null, lastError: undefined }));
    handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLFormElement>);
  };

  // Returns a step-specific label so users know exactly what's happening during submission
  const submitLabel = () => {
    switch (formState.submitStep) {
      case 'hashing': return 'Reading document...';
      case 'uploading': return 'Uploading...';
      case 'registering': return 'Registering...';
      default: return 'Register Document';
    }
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
            {/* File Drop Zone */}
            <div className="border-l-4 border-blue-600 pl-6 py-2">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Document File *
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  formState.validationErrors.file
                    ? 'border-red-300 bg-red-50'
                    : isDragging
                    ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                    : formState.file
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  disabled={formState.isSubmitting}
                  className="hidden"
                />
                <label htmlFor="file" className="cursor-pointer block">
                  {formState.file ? (
                    <div>
                      {/* File selected icon */}
                      <div className="flex justify-center mb-3">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="font-semibold text-gray-900">{formState.file.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(formState.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-blue-600 mt-2">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      {/* Upload icon */}
                      <div className="flex justify-center mb-3">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="font-semibold text-gray-700">
                        {isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PDF, JPG, or PNG — max 10MB</p>
                    </div>
                  )}
                </label>
              </div>
              {formState.validationErrors.file && (
                <p className="mt-2 text-sm text-red-600">{formState.validationErrors.file}</p>
              )}
            </div>

            {/* Owner Name */}
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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  formState.validationErrors.ownerName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter property owner's full name"
              />
              {formState.validationErrors.ownerName && (
                <p className="mt-2 text-sm text-red-600">{formState.validationErrors.ownerName}</p>
              )}
            </div>

            {/* Property Details */}
            <div className="border-l-4 border-blue-600 pl-6 py-2 space-y-4">
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    formState.validationErrors.propertyAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder={`Enter the ${propertyAddressLabel.toLowerCase()}`}
                />
                {formState.validationErrors.propertyAddress && (
                  <p className="mt-2 text-sm text-red-600">{formState.validationErrors.propertyAddress}</p>
                )}
              </div>

              <div>
                <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type *
                </label>
                <select
                  id="documentType"
                  value={formState.documentType}
                  onChange={(e) => handleInputChange(e, 'documentType')}
                  disabled={formState.isSubmitting}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    formState.validationErrors.documentType ? 'border-amber-400 bg-amber-50' : 'border-gray-300'
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    formState.validationErrors.documentDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {formState.validationErrors.documentDate && (
                  <p className="mt-2 text-sm text-red-600">{formState.validationErrors.documentDate}</p>
                )}
              </div>
            </div>

            {/* Processing Steps Indicator */}
            {formState.isSubmitting && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-800 mb-3">Processing your document...</p>
                <div className="flex items-center gap-3">
                  {(['hashing', 'uploading', 'registering'] as const).map((step, i) => {
                    const steps = ['hashing', 'uploading', 'registering'] as const;
                    const currentIdx = steps.indexOf(formState.submitStep as typeof steps[number]);
                    const stepIdx = i;
                    const isDone = stepIdx < currentIdx;
                    const isActive = stepIdx === currentIdx;
                    const labels = ['Reading', 'Uploading', 'Registering'];
                    return (
                      <div key={step} className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isDone ? '✓' : i + 1}
                        </div>
                        <span className={`text-xs font-medium ${isActive ? 'text-blue-700' : isDone ? 'text-green-700' : 'text-gray-400'}`}>
                          {labels[i]}
                        </span>
                        {i < 2 && <span className="text-gray-300 text-xs">→</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-4 rounded-lg transition duration-200 flex items-center justify-center text-lg"
              >
                {formState.isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {submitLabel()}
                  </>
                ) : (
                  'Register Document'
                )}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            * Required fields. Your document is hashed in your browser — the original file is never read by our servers.
          </p>
        </div>
      </div>
    </main>
  );
}
