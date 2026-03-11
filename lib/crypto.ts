/**
 * Cryptographic utilities for EXTATE document protection
 * 
 * This module provides client-side SHA-256 hash computation using the Web Crypto API.
 * All cryptographic operations run in the browser to ensure document privacy.
 */

import { logHashComputationError, logBrowserCompatibilityIssue } from './error-logger';

/**
 * Error thrown when the Web Crypto API is not available in the browser
 */
export class CryptoNotSupportedError extends Error {
  constructor() {
    super('Web Crypto API is not supported in this browser. Please use a modern browser like Chrome, Firefox, Safari, or Edge.');
    this.name = 'CryptoNotSupportedError';
  }
}

/**
 * Error thrown when hash computation fails
 */
export class HashComputationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'HashComputationError';
  }
}

/**
 * Checks if the Web Crypto API is available in the current browser
 * 
 * @returns true if crypto.subtle is available, false otherwise
 */
export function isCryptoSupported(): boolean {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined' &&
         typeof crypto.subtle.digest === 'function';
}

/**
 * Computes the SHA-256 hash of a file
 * 
 * This function reads the file contents, computes the SHA-256 hash using the
 * Web Crypto API, and returns the hash as a lowercase hexadecimal string.
 * 
 * @param file - The file to hash
 * @returns Promise resolving to a 64-character lowercase hexadecimal string
 * @throws {CryptoNotSupportedError} If Web Crypto API is not available
 * @throws {HashComputationError} If hash computation fails
 * 
 * @example
 * ```typescript
 * const file = new File(['content'], 'document.pdf');
 * const hash = await computeSHA256(file);
 * console.log(hash); // "ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73"
 * ```
 */
export async function computeSHA256(file: File): Promise<string> {
  // Check browser support
  if (!isCryptoSupported()) {
    logBrowserCompatibilityIssue('Web Crypto API');
    throw new CryptoNotSupportedError();
  }

  try {
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Compute SHA-256 hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    
    // Convert hash buffer to byte array
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    // Convert bytes to lowercase hexadecimal string
    const hashHex = hashArray
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
    
    return hashHex;
  } catch (error) {
    // Handle file reading errors or crypto API errors
    if (error instanceof CryptoNotSupportedError) {
      throw error;
    }
    
    logHashComputationError(
      error instanceof Error ? error : new Error(String(error)),
      file.name
    );
    
    throw new HashComputationError(
      'Failed to compute SHA-256 hash. Please try again.',
      error
    );
  }
}
