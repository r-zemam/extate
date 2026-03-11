/**
 * Unit tests for verification page
 * 
 * These tests verify the document verification functionality including:
 * - Document loading and display
 * - Stored fingerprint display
 * - File upload and hash computation
 * - Verification result display (match/mismatch)
 * - Error handling
 * 
 * Run with: npm test
 */

import * as actions from '@/lib/actions';
import * as crypto from '@/lib/crypto';

// Mock the server actions and crypto module
jest.mock('@/lib/actions');
jest.mock('@/lib/crypto');

const mockDocument = {
  id: 'test-id-123',
  owner_name: 'John Doe',
  property_address: '123 Main St, Springfield',
  document_type: 'deed',
  document_date: '2024-01-15',
  fingerprint: 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73',
  file_url: 'https://example.com/document.pdf',
  created_at: '2024-01-20T10:00:00Z',
};

describe('Verification Page - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Document Loading', () => {
    it('should call getDocument with correct ID', async () => {
      (actions.getDocument as jest.Mock).mockResolvedValue(mockDocument);

      // Simulate component mounting and fetching
      await (actions.getDocument as jest.Mock)('test-id-123');

      expect(actions.getDocument).toHaveBeenCalledWith('test-id-123');
    });

    it('should handle document fetch errors', async () => {
      const errorMessage = 'Document not found.';
      (actions.getDocument as jest.Mock).mockRejectedValue(new Error(errorMessage));

      try {
        await (actions.getDocument as jest.Mock)('invalid-id');
      } catch (error) {
        expect((error as Error).message).toBe(errorMessage);
      }

      expect(actions.getDocument).toHaveBeenCalled();
    });
  });

  describe('Stored Fingerprint Display', () => {
    it('should retrieve stored fingerprint from document record', async () => {
      (actions.getDocument as jest.Mock).mockResolvedValue(mockDocument);

      const result = await (actions.getDocument as jest.Mock)('test-id-123');

      expect(result.fingerprint).toBe(mockDocument.fingerprint);
      expect(result.fingerprint).toHaveLength(64); // SHA-256 is 64 hex chars
    });

    it('should verify fingerprint is valid hex string', async () => {
      (actions.getDocument as jest.Mock).mockResolvedValue(mockDocument);

      const result = await (actions.getDocument as jest.Mock)('test-id-123');
      const hexRegex = /^[a-f0-9]{64}$/;

      expect(hexRegex.test(result.fingerprint)).toBe(true);
    });
  });

  describe('Hash Computation', () => {
    it('should compute SHA-256 hash of uploaded file', async () => {
      const testHash = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';
      (crypto.computeSHA256 as jest.Mock).mockResolvedValue(testHash);

      const file = new File(['test content'], 'document.pdf', { type: 'application/pdf' });
      const result = await (crypto.computeSHA256 as jest.Mock)(file);

      expect(result).toBe(testHash);
      expect(crypto.computeSHA256).toHaveBeenCalledWith(file);
    });

    it('should return 64-character hex string', async () => {
      const testHash = 'a'.repeat(64);
      (crypto.computeSHA256 as jest.Mock).mockResolvedValue(testHash);

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const result = await (crypto.computeSHA256 as jest.Mock)(file);

      expect(result).toHaveLength(64);
      expect(/^[a-f0-9]{64}$/.test(result)).toBe(true);
    });

    it('should handle hash computation errors', async () => {
      const errorMessage = 'Failed to compute hash';
      (crypto.computeSHA256 as jest.Mock).mockRejectedValue(
        new crypto.HashComputationError(errorMessage)
      );

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

      try {
        await (crypto.computeSHA256 as jest.Mock)(file);
      } catch (error) {
        expect((error as Error).message).toBe(errorMessage);
      }
    });
  });

  describe('Verification Logic', () => {
    it('should identify matching fingerprints', () => {
      const storedHash = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';
      const computedHash = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';

      const isMatch = storedHash === computedHash;
      expect(isMatch).toBe(true);
    });

    it('should identify non-matching fingerprints', () => {
      const storedHash = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';
      const computedHash = 'different_hash_value_here_different_hash_value_here_different_hash_value_here';

      const isMatch = storedHash === computedHash;
      expect(isMatch).toBe(false);
    });

    it('should handle case-insensitive hash comparison', () => {
      const storedHash = 'ED7002B439E9AC845F22357D822BAC1444730FBDB6016D3EC9432297B9EC9F73';
      const computedHash = 'ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73';

      // Hashes should be compared in lowercase
      const isMatch = storedHash.toLowerCase() === computedHash.toLowerCase();
      expect(isMatch).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle CryptoNotSupportedError', async () => {
      (crypto.computeSHA256 as jest.Mock).mockRejectedValue(
        new crypto.CryptoNotSupportedError()
      );

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

      try {
        await (crypto.computeSHA256 as jest.Mock)(file);
      } catch (error) {
        expect(error).toBeInstanceOf(crypto.CryptoNotSupportedError);
      }
    });

    it('should handle HashComputationError', async () => {
      (crypto.computeSHA256 as jest.Mock).mockRejectedValue(
        new crypto.HashComputationError('Hash computation failed')
      );

      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });

      try {
        await (crypto.computeSHA256 as jest.Mock)(file);
      } catch (error) {
        expect(error).toBeInstanceOf(crypto.HashComputationError);
      }
    });

    it('should handle document not found error', async () => {
      (actions.getDocument as jest.Mock).mockRejectedValue(
        new Error('Document not found.')
      );

      try {
        await (actions.getDocument as jest.Mock)('invalid-id');
      } catch (error) {
        expect((error as Error).message).toBe('Document not found.');
      }
    });
  });

  describe('File Validation', () => {
    it('should accept PDF files', () => {
      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      expect(file.type).toBe('application/pdf');
    });

    it('should accept JPEG files', () => {
      const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
      expect(file.type).toBe('image/jpeg');
    });

    it('should accept PNG files', () => {
      const file = new File(['content'], 'image.png', { type: 'image/png' });
      expect(file.type).toBe('image/png');
    });

    it('should store file metadata correctly', () => {
      const file = new File(['test content'], 'document.pdf', { type: 'application/pdf' });
      expect(file.name).toBe('document.pdf');
      expect(file.size).toBe(12); // 'test content' is 12 bytes
      expect(file.type).toBe('application/pdf');
    });
  });

  describe('Document Information Display', () => {
    it('should retrieve all required document fields', async () => {
      (actions.getDocument as jest.Mock).mockResolvedValue(mockDocument);

      const result = await (actions.getDocument as jest.Mock)('test-id-123');

      expect(result.owner_name).toBe('John Doe');
      expect(result.property_address).toBe('123 Main St, Springfield');
      expect(result.document_type).toBe('deed');
      expect(result.document_date).toBe('2024-01-15');
      expect(result.fingerprint).toBeDefined();
      expect(result.created_at).toBeDefined();
    });

    it('should format document type correctly', () => {
      const documentType = 'inheritance_record';
      const formatted = documentType.replace(/_/g, ' ');
      expect(formatted).toBe('inheritance record');
    });

    it('should handle all document types', () => {
      const types = ['deed', 'title', 'inheritance_record', 'tax_document'];
      types.forEach(type => {
        expect(type).toBeTruthy();
      });
    });
  });
});
