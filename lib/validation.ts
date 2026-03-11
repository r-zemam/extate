/**
 * Validation utilities for EXTATE document protection
 * 
 * This module provides validation functions for file uploads and form data.
 * Validates file types, file sizes, and required fields according to requirements.
 */

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Result of form validation with field-specific errors
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: {
    file?: string;
    ownerName?: string;
    propertyAddress?: string;
    documentType?: string;
    documentDate?: string;
  };
}

/**
 * Allowed file types for document uploads
 */
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
] as const;

/**
 * Allowed file extensions for document uploads
 */
const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'] as const;

/**
 * Maximum file size in bytes (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Valid document types
 */
const VALID_DOCUMENT_TYPES = [
  'deed',
  'title',
  'inheritance_record',
  'tax_document'
] as const;

/**
 * Validates that a file is of an allowed type (PDF, JPG, PNG)
 * 
 * @param file - The file to validate
 * @returns ValidationResult indicating if the file type is valid
 * 
 * @example
 * ```typescript
 * const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
 * const result = validateFileType(file);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateFileType(file: File): ValidationResult {
  if (!file) {
    return {
      isValid: false,
      error: 'No file provided.'
    };
  }

  // Check MIME type
  const mimeTypeValid = ALLOWED_FILE_TYPES.includes(file.type as any);
  
  // Check file extension as fallback (some browsers may not set MIME type correctly)
  const fileName = file.name.toLowerCase();
  const extensionValid = ALLOWED_FILE_EXTENSIONS.some(ext => fileName.endsWith(ext));

  if (!mimeTypeValid && !extensionValid) {
    return {
      isValid: false,
      error: 'Please upload a PDF or image file (JPG, PNG).'
    };
  }

  return { isValid: true };
}

/**
 * Validates that a file size is within the allowed limit (10MB)
 * 
 * @param file - The file to validate
 * @returns ValidationResult indicating if the file size is valid
 * 
 * @example
 * ```typescript
 * const file = new File(['content'], 'document.pdf');
 * const result = validateFileSize(file);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateFileSize(file: File): ValidationResult {
  if (!file) {
    return {
      isValid: false,
      error: 'No file provided.'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `File size must be under 10MB. Your file is ${fileSizeMB}MB. Please choose a smaller file.`
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty. Please choose a valid file.'
    };
  }

  return { isValid: true };
}

/**
 * Validates that a required field is not empty
 * 
 * @param value - The field value to validate
 * @param fieldName - The name of the field (for error messages)
 * @returns ValidationResult indicating if the field is valid
 * 
 * @example
 * ```typescript
 * const result = validateRequiredField(ownerName, 'Owner name');
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateRequiredField(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: `${fieldName} is required.`
    };
  }

  return { isValid: true };
}

/**
 * Validates the complete upload form data
 * 
 * @param formData - Object containing all form fields
 * @returns FormValidationResult with field-specific errors
 * 
 * @example
 * ```typescript
 * const result = validateUploadForm({
 *   file: selectedFile,
 *   ownerName: 'John Doe',
 *   propertyAddress: '123 Main St',
 *   documentType: 'deed',
 *   documentDate: '2024-01-15'
 * });
 * 
 * if (!result.isValid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateUploadForm(formData: {
  file: File | null;
  ownerName: string;
  propertyAddress: string;
  documentType: string;
  documentDate: string;
}): FormValidationResult {
  const errors: FormValidationResult['errors'] = {};
  let isValid = true;

  // Validate file
  if (!formData.file) {
    errors.file = 'Please select a file to upload.';
    isValid = false;
  } else {
    // Validate file type
    const fileTypeResult = validateFileType(formData.file);
    if (!fileTypeResult.isValid) {
      errors.file = fileTypeResult.error;
      isValid = false;
    }

    // Validate file size
    const fileSizeResult = validateFileSize(formData.file);
    if (!fileSizeResult.isValid) {
      errors.file = fileSizeResult.error;
      isValid = false;
    }
  }

  // Validate owner name
  const ownerNameResult = validateRequiredField(formData.ownerName, 'Owner name');
  if (!ownerNameResult.isValid) {
    errors.ownerName = ownerNameResult.error;
    isValid = false;
  }

  // Validate property address
  const propertyAddressResult = validateRequiredField(formData.propertyAddress, 'Property address');
  if (!propertyAddressResult.isValid) {
    errors.propertyAddress = propertyAddressResult.error;
    isValid = false;
  }

  // Validate document type
  const documentTypeResult = validateRequiredField(formData.documentType, 'Document type');
  if (!documentTypeResult.isValid) {
    errors.documentType = documentTypeResult.error;
    isValid = false;
  } else if (!VALID_DOCUMENT_TYPES.includes(formData.documentType as any)) {
    errors.documentType = 'Please select a valid document type.';
    isValid = false;
  }

  // Validate document date
  const documentDateResult = validateRequiredField(formData.documentDate, 'Document date');
  if (!documentDateResult.isValid) {
    errors.documentDate = documentDateResult.error;
    isValid = false;
  }

  return {
    isValid,
    errors
  };
}
