/**
 * Unit tests for validation module
 * 
 * These tests verify file type, file size, and form validation functionality.
 * Run with: npm test
 */

import {
  validateFileType,
  validateFileSize,
  validateRequiredField,
  validateUploadForm,
  ValidationResult,
  FormValidationResult
} from '../validation';

describe('validateFileType', () => {
  it('should accept PDF files', () => {
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const result = validateFileType(file);
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept JPEG files', () => {
    const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
    const result = validateFileType(file);
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept JPG files with image/jpg MIME type', () => {
    const file = new File(['content'], 'image.jpg', { type: 'image/jpg' });
    const result = validateFileType(file);
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept PNG files', () => {
    const file = new File(['content'], 'image.png', { type: 'image/png' });
    const result = validateFileType(file);
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject text files', () => {
    const file = new File(['content'], 'document.txt', { type: 'text/plain' });
    const result = validateFileType(file);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please upload a PDF or image file (JPG, PNG).');
  });

  it('should reject Word documents', () => {
    const file = new File(['content'], 'document.docx', { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    const result = validateFileType(file);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please upload a PDF or image file (JPG, PNG).');
  });

  it('should reject ZIP files', () => {
    const file = new File(['content'], 'archive.zip', { type: 'application/zip' });
    const result = validateFileType(file);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please upload a PDF or image file (JPG, PNG).');
  });

  it('should accept files with correct extension even if MIME type is missing', () => {
    // Some browsers may not set MIME type correctly
    const file = new File(['content'], 'document.pdf', { type: '' });
    const result = validateFileType(file);
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should handle uppercase file extensions', () => {
    const file = new File(['content'], 'DOCUMENT.PDF', { type: '' });
    const result = validateFileType(file);
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject null file', () => {
    const result = validateFileType(null as any);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('No file provided.');
  });

  it('should reject undefined file', () => {
    const result = validateFileType(undefined as any);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('No file provided.');
  });
});

describe('validateFileSize', () => {
  it('should accept files under 10MB', () => {
    const size = 5 * 1024 * 1024; // 5MB
    const buffer = new ArrayBuffer(size);
    const file = new File([buffer], 'document.pdf', { type: 'application/pdf' });
    
    const result = validateFileSize(file);
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept files exactly at 10MB limit', () => {
    const size = 10 * 1024 * 1024; // Exactly 10MB
    const buffer = new ArrayBuffer(size);
    const file = new File([buffer], 'document.pdf', { type: 'application/pdf' });
    
    const result = validateFileSize(file);
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject files over 10MB', () => {
    const size = 11 * 1024 * 1024; // 11MB
    const buffer = new ArrayBuffer(size);
    const file = new File([buffer], 'large.pdf', { type: 'application/pdf' });
    
    const result = validateFileSize(file);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('File size must be under 10MB');
    expect(result.error).toContain('11.00MB');
  });

  it('should reject empty files', () => {
    const file = new File([], 'empty.pdf', { type: 'application/pdf' });
    
    const result = validateFileSize(file);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('File is empty. Please choose a valid file.');
  });

  it('should accept small files', () => {
    const file = new File(['small content'], 'small.pdf', { type: 'application/pdf' });
    
    const result = validateFileSize(file);
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should provide file size in error message', () => {
    const size = 15 * 1024 * 1024; // 15MB
    const buffer = new ArrayBuffer(size);
    const file = new File([buffer], 'large.pdf', { type: 'application/pdf' });
    
    const result = validateFileSize(file);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/15\.\d{2}MB/);
  });

  it('should reject null file', () => {
    const result = validateFileSize(null as any);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('No file provided.');
  });

  it('should reject undefined file', () => {
    const result = validateFileSize(undefined as any);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('No file provided.');
  });
});

describe('validateRequiredField', () => {
  it('should accept non-empty strings', () => {
    const result = validateRequiredField('John Doe', 'Owner name');
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject empty strings', () => {
    const result = validateRequiredField('', 'Owner name');
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Owner name is required.');
  });

  it('should reject strings with only whitespace', () => {
    const result = validateRequiredField('   ', 'Property address');
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Property address is required.');
  });

  it('should accept strings with leading/trailing whitespace', () => {
    const result = validateRequiredField('  Valid Content  ', 'Document type');
    
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should use field name in error message', () => {
    const result = validateRequiredField('', 'Custom Field');
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Custom Field is required.');
  });

  it('should reject null values', () => {
    const result = validateRequiredField(null as any, 'Field name');
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Field name is required.');
  });

  it('should reject undefined values', () => {
    const result = validateRequiredField(undefined as any, 'Field name');
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Field name is required.');
  });
});

describe('validateUploadForm', () => {
  const createValidFormData = () => ({
    file: new File(['content'], 'document.pdf', { type: 'application/pdf' }),
    ownerName: 'John Doe',
    propertyAddress: '123 Main Street',
    documentType: 'deed',
    documentDate: '2024-01-15'
  });

  it('should accept valid form data', () => {
    const formData = createValidFormData();
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should reject form with missing file', () => {
    const formData = {
      ...createValidFormData(),
      file: null
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.file).toBe('Please select a file to upload.');
  });

  it('should reject form with invalid file type', () => {
    const formData = {
      ...createValidFormData(),
      file: new File(['content'], 'document.txt', { type: 'text/plain' })
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.file).toBe('Please upload a PDF or image file (JPG, PNG).');
  });

  it('should reject form with oversized file', () => {
    const size = 11 * 1024 * 1024; // 11MB
    const buffer = new ArrayBuffer(size);
    const formData = {
      ...createValidFormData(),
      file: new File([buffer], 'large.pdf', { type: 'application/pdf' })
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.file).toContain('File size must be under 10MB');
  });

  it('should reject form with empty owner name', () => {
    const formData = {
      ...createValidFormData(),
      ownerName: ''
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.ownerName).toBe('Owner name is required.');
  });

  it('should reject form with whitespace-only owner name', () => {
    const formData = {
      ...createValidFormData(),
      ownerName: '   '
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.ownerName).toBe('Owner name is required.');
  });

  it('should reject form with empty property address', () => {
    const formData = {
      ...createValidFormData(),
      propertyAddress: ''
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.propertyAddress).toBe('Property address is required.');
  });

  it('should reject form with empty document type', () => {
    const formData = {
      ...createValidFormData(),
      documentType: ''
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.documentType).toBe('Document type is required.');
  });

  it('should reject form with invalid document type', () => {
    const formData = {
      ...createValidFormData(),
      documentType: 'invalid_type'
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.documentType).toBe('Please select a valid document type.');
  });

  it('should accept all valid document types', () => {
    const validTypes = ['deed', 'title', 'inheritance_record', 'tax_document'];
    
    validTypes.forEach(type => {
      const formData = {
        ...createValidFormData(),
        documentType: type
      };
      const result = validateUploadForm(formData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.documentType).toBeUndefined();
    });
  });

  it('should reject form with empty document date', () => {
    const formData = {
      ...createValidFormData(),
      documentDate: ''
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.documentDate).toBe('Document date is required.');
  });

  it('should collect multiple validation errors', () => {
    const formData = {
      file: null,
      ownerName: '',
      propertyAddress: '',
      documentType: '',
      documentDate: ''
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(false);
    expect(result.errors.file).toBeDefined();
    expect(result.errors.ownerName).toBeDefined();
    expect(result.errors.propertyAddress).toBeDefined();
    expect(result.errors.documentType).toBeDefined();
    expect(result.errors.documentDate).toBeDefined();
  });

  it('should accept form with image files', () => {
    const jpgFormData = {
      ...createValidFormData(),
      file: new File(['content'], 'image.jpg', { type: 'image/jpeg' })
    };
    const jpgResult = validateUploadForm(jpgFormData);
    expect(jpgResult.isValid).toBe(true);

    const pngFormData = {
      ...createValidFormData(),
      file: new File(['content'], 'image.png', { type: 'image/png' })
    };
    const pngResult = validateUploadForm(pngFormData);
    expect(pngResult.isValid).toBe(true);
  });

  it('should trim whitespace when validating required fields', () => {
    const formData = {
      ...createValidFormData(),
      ownerName: '  John Doe  ',
      propertyAddress: '  123 Main St  '
    };
    const result = validateUploadForm(formData);
    
    expect(result.isValid).toBe(true);
  });
});
