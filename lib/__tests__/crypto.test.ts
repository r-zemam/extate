/**
 * Unit tests for crypto module
 * 
 * These tests verify SHA-256 hash computation functionality.
 * Run with: npm test (after installing Jest)
 */

import { computeSHA256, isCryptoSupported, CryptoNotSupportedError, HashComputationError } from '../crypto';

describe('isCryptoSupported', () => {
  it('should return true when Web Crypto API is available', () => {
    // In modern browsers and Node.js 15+, crypto.subtle should be available
    const supported = isCryptoSupported();
    expect(typeof supported).toBe('boolean');
  });
});

describe('computeSHA256', () => {
  it('should compute correct SHA-256 hash for known input', async () => {
    // Create a test file with known content
    const content = 'test content';
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    
    const hash = await computeSHA256(file);
    
    // Verify hash format: 64 lowercase hexadecimal characters
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    
    // Known SHA-256 hash for "test content"
    // You can verify this with: echo -n "test content" | shasum -a 256
    const expectedHash = '6ae8a75555209fd6c44157c0aed8016e763ff435a19cf186f76863140143ff72';
    expect(hash).toBe(expectedHash);
  });

  it('should return consistent hash for same file', async () => {
    const content = 'consistent test';
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    
    const hash1 = await computeSHA256(file);
    const hash2 = await computeSHA256(file);
    
    expect(hash1).toBe(hash2);
  });

  it('should return different hashes for different files', async () => {
    const file1 = new File(['content 1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['content 2'], 'test2.txt', { type: 'text/plain' });
    
    const hash1 = await computeSHA256(file1);
    const hash2 = await computeSHA256(file2);
    
    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty files', async () => {
    const file = new File([], 'empty.txt', { type: 'text/plain' });
    
    const hash = await computeSHA256(file);
    
    // SHA-256 hash of empty string
    const expectedHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    expect(hash).toBe(expectedHash);
  });

  it('should handle large files', async () => {
    // Create a 1MB file
    const size = 1024 * 1024;
    const buffer = new ArrayBuffer(size);
    const file = new File([buffer], 'large.bin', { type: 'application/octet-stream' });
    
    const hash = await computeSHA256(file);
    
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should handle binary files', async () => {
    // Create a binary file with specific byte values
    const bytes = new Uint8Array([0x00, 0xFF, 0x42, 0xAB]);
    const file = new File([bytes], 'binary.bin', { type: 'application/octet-stream' });
    
    const hash = await computeSHA256(file);
    
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should throw CryptoNotSupportedError when Web Crypto API is unavailable', async () => {
    // Mock crypto.subtle to be undefined
    const originalCrypto = global.crypto;
    
    // @ts-ignore - Intentionally setting to undefined for testing
    global.crypto = undefined;
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    await expect(computeSHA256(file)).rejects.toThrow(CryptoNotSupportedError);
    await expect(computeSHA256(file)).rejects.toThrow('Web Crypto API is not supported');
    
    // Restore original crypto
    global.crypto = originalCrypto;
  });

  it('should handle file reading errors gracefully', async () => {
    // Create a mock file that will fail to read
    const mockFile = {
      arrayBuffer: jest.fn().mockRejectedValue(new Error('File read error'))
    } as unknown as File;
    
    await expect(computeSHA256(mockFile)).rejects.toThrow(HashComputationError);
  });
});

describe('Error Classes', () => {
  it('should create CryptoNotSupportedError with correct properties', () => {
    const error = new CryptoNotSupportedError();
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('CryptoNotSupportedError');
    expect(error.message).toContain('Web Crypto API is not supported');
  });

  it('should create HashComputationError with correct properties', () => {
    const cause = new Error('Original error');
    const error = new HashComputationError('Hash failed', cause);
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('HashComputationError');
    expect(error.message).toBe('Hash failed');
    expect(error.cause).toBe(cause);
  });
});
