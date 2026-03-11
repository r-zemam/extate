'use client';

import { useState } from 'react';
import { computeSHA256, isCryptoSupported, CryptoNotSupportedError, HashComputationError } from '@/lib/crypto';

/**
 * Test page for crypto module
 * 
 * This page allows manual testing of the SHA-256 hash computation
 * functionality in the browser.
 */
export default function TestCryptoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isComputing, setIsComputing] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const supported = isCryptoSupported();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setHash('');
      setError('');
    }
  };

  const handleComputeHash = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsComputing(true);
    setError('');
    setHash('');

    try {
      const computedHash = await computeSHA256(file);
      setHash(computedHash);
    } catch (err) {
      if (err instanceof CryptoNotSupportedError) {
        setError(err.message);
      } else if (err instanceof HashComputationError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsComputing(false);
    }
  };

  const runAutomatedTests = async () => {
    const results: string[] = [];
    
    // Test 1: Known content hash
    try {
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const testHash = await computeSHA256(testFile);
      const expectedHash = '6ae8a75555209fd6c44157c0aed8016e763ff435a19cf186f76863140143ff72';
      
      if (testHash === expectedHash) {
        results.push('✅ Test 1 PASSED: Known content hash matches');
      } else {
        results.push(`❌ Test 1 FAILED: Expected ${expectedHash}, got ${testHash}`);
      }
    } catch (err) {
      results.push(`❌ Test 1 FAILED: ${err}`);
    }

    // Test 2: Empty file hash
    try {
      const emptyFile = new File([], 'empty.txt', { type: 'text/plain' });
      const emptyHash = await computeSHA256(emptyFile);
      const expectedEmptyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
      
      if (emptyHash === expectedEmptyHash) {
        results.push('✅ Test 2 PASSED: Empty file hash matches');
      } else {
        results.push(`❌ Test 2 FAILED: Expected ${expectedEmptyHash}, got ${emptyHash}`);
      }
    } catch (err) {
      results.push(`❌ Test 2 FAILED: ${err}`);
    }

    // Test 3: Consistency check
    try {
      const file1 = new File(['consistent'], 'test.txt', { type: 'text/plain' });
      const hash1 = await computeSHA256(file1);
      const hash2 = await computeSHA256(file1);
      
      if (hash1 === hash2) {
        results.push('✅ Test 3 PASSED: Hash computation is consistent');
      } else {
        results.push('❌ Test 3 FAILED: Hash computation is inconsistent');
      }
    } catch (err) {
      results.push(`❌ Test 3 FAILED: ${err}`);
    }

    // Test 4: Different files produce different hashes
    try {
      const fileA = new File(['content A'], 'a.txt', { type: 'text/plain' });
      const fileB = new File(['content B'], 'b.txt', { type: 'text/plain' });
      const hashA = await computeSHA256(fileA);
      const hashB = await computeSHA256(fileB);
      
      if (hashA !== hashB) {
        results.push('✅ Test 4 PASSED: Different files produce different hashes');
      } else {
        results.push('❌ Test 4 FAILED: Different files produced same hash');
      }
    } catch (err) {
      results.push(`❌ Test 4 FAILED: ${err}`);
    }

    // Test 5: Hash format validation
    try {
      const testFile = new File(['format test'], 'test.txt', { type: 'text/plain' });
      const testHash = await computeSHA256(testFile);
      const isValidFormat = /^[a-f0-9]{64}$/.test(testHash);
      
      if (isValidFormat) {
        results.push('✅ Test 5 PASSED: Hash format is valid (64 lowercase hex chars)');
      } else {
        results.push(`❌ Test 5 FAILED: Invalid hash format: ${testHash}`);
      }
    } catch (err) {
      results.push(`❌ Test 5 FAILED: ${err}`);
    }

    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Crypto Module Test Page
        </h1>

        {/* Browser Support Check */}
        <div className={`mb-8 p-4 rounded-lg ${supported ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h2 className="text-lg font-semibold mb-2">
            {supported ? '✅ Web Crypto API Supported' : '❌ Web Crypto API Not Supported'}
          </h2>
          <p className="text-sm text-gray-600">
            {supported 
              ? 'Your browser supports the Web Crypto API. All tests should work.'
              : 'Your browser does not support the Web Crypto API. Please use a modern browser like Chrome, Firefox, Safari, or Edge.'}
          </p>
        </div>

        {/* Manual File Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Manual File Hash Test</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a file to hash:
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {file && (
              <div className="text-sm text-gray-600">
                <p><strong>File:</strong> {file.name}</p>
                <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                <p><strong>Type:</strong> {file.type || 'unknown'}</p>
              </div>
            )}

            <button
              onClick={handleComputeHash}
              disabled={!file || isComputing || !supported}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isComputing ? 'Computing...' : 'Compute SHA-256 Hash'}
            </button>

            {hash && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm font-medium text-green-800 mb-2">Hash computed successfully:</p>
                <code className="block text-xs font-mono bg-white p-2 rounded border break-all">
                  {hash}
                </code>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Automated Tests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Automated Tests</h2>
          
          <button
            onClick={runAutomatedTests}
            disabled={!supported}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
          >
            Run All Tests
          </button>

          {testResults.length > 0 && (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md ${
                    result.startsWith('✅') 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  <code className="text-sm font-mono">{result}</code>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documentation */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About This Test Page</h2>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              This page tests the <code className="bg-white px-1 py-0.5 rounded">lib/crypto.ts</code> module
              which provides SHA-256 hash computation for the EXTATE document protection system.
            </p>
            <p>
              <strong>Manual Test:</strong> Upload any file to compute its SHA-256 hash.
            </p>
            <p>
              <strong>Automated Tests:</strong> Run predefined tests to verify:
            </p>
            <ul className="list-disc list-inside ml-4">
              <li>Known content produces expected hash</li>
              <li>Empty files produce correct hash</li>
              <li>Hash computation is consistent</li>
              <li>Different files produce different hashes</li>
              <li>Hash format is valid (64 lowercase hex characters)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
