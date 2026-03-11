/**
 * Tests for server actions
 * 
 * Validates:
 * - Requirements 4.1, 4.2, 4.3 (document upload and storage)
 */

import { uploadDocument, getDocument } from '../actions';
import { supabase } from '../supabase';

// Mock Supabase
jest.mock('../supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadDocument', () => {
    it('should upload file and create database record', async () => {
      const mockFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const mockFingerprint = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';
      const mockDocumentId = 'test-id-123';

      // Mock storage upload
      const mockStorageFrom = jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: { path: 'test-id-123.pdf' },
          error: null,
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/test-id-123.pdf' },
        }),
      });

      // Mock database insert
      const mockDatabaseFrom = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: mockDocumentId },
              error: null,
            }),
          }),
        }),
      });

      (supabase.storage.from as jest.Mock) = mockStorageFrom;
      (supabase.from as jest.Mock) = mockDatabaseFrom;

      const formData = new FormData();
      formData.append('file', mockFile);
      formData.append('ownerName', 'John Doe');
      formData.append('propertyAddress', '123 Main St');
      formData.append('documentType', 'deed');
      formData.append('documentDate', '2024-01-15');

      const result = await uploadDocument(formData, mockFingerprint);

      expect(result.id).toBe(mockDocumentId);
      expect(mockStorageFrom).toHaveBeenCalledWith('documents');
      expect(mockDatabaseFrom).toHaveBeenCalledWith('documents');
    });

    it('should throw error if storage upload fails', async () => {
      const mockFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const mockFingerprint = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';

      // Mock storage upload failure
      const mockStorageFrom = jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Upload failed'),
        }),
      });

      (supabase.storage.from as jest.Mock) = mockStorageFrom;

      const formData = new FormData();
      formData.append('file', mockFile);
      formData.append('ownerName', 'John Doe');
      formData.append('propertyAddress', '123 Main St');
      formData.append('documentType', 'deed');
      formData.append('documentDate', '2024-01-15');

      await expect(uploadDocument(formData, mockFingerprint)).rejects.toThrow(
        'Failed to upload file'
      );
    });

    it('should throw error if database insert fails', async () => {
      const mockFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const mockFingerprint = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';

      // Mock storage upload success
      const mockStorageFrom = jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: { path: 'test-id-123.pdf' },
          error: null,
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/test-id-123.pdf' },
        }),
        remove: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      // Mock database insert failure
      const mockDatabaseFrom = jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Insert failed'),
            }),
          }),
        }),
      });

      (supabase.storage.from as jest.Mock) = mockStorageFrom;
      (supabase.from as jest.Mock) = mockDatabaseFrom;

      const formData = new FormData();
      formData.append('file', mockFile);
      formData.append('ownerName', 'John Doe');
      formData.append('propertyAddress', '123 Main St');
      formData.append('documentType', 'deed');
      formData.append('documentDate', '2024-01-15');

      await expect(uploadDocument(formData, mockFingerprint)).rejects.toThrow(
        'Failed to register document'
      );
    });

    it('should throw error if missing required fields', async () => {
      const mockFingerprint = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';

      const formData = new FormData();
      // Missing required fields

      await expect(uploadDocument(formData, mockFingerprint)).rejects.toThrow(
        'Missing required form fields'
      );
    });
  });

  describe('getDocument', () => {
    it('should retrieve document by ID', async () => {
      const mockDocumentId = 'test-id-123';
      const mockDocument = {
        id: mockDocumentId,
        owner_name: 'John Doe',
        property_address: '123 Main St',
        document_type: 'deed',
        document_date: '2024-01-15',
        fingerprint: 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73',
        file_url: 'https://example.com/test-id-123.pdf',
        created_at: '2024-01-20T10:00:00Z',
      };

      const mockDatabaseFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockDocument,
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as jest.Mock) = mockDatabaseFrom;

      const result = await getDocument(mockDocumentId);

      expect(result).toEqual(mockDocument);
      expect(mockDatabaseFrom).toHaveBeenCalledWith('documents');
    });

    it('should throw error if document not found', async () => {
      const mockDocumentId = 'nonexistent-id';

      const mockDatabaseFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: new Error('Not found'),
            }),
          }),
        }),
      });

      (supabase.from as jest.Mock) = mockDatabaseFrom;

      await expect(getDocument(mockDocumentId)).rejects.toThrow('Document not found');
    });
  });
});
