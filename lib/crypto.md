# Crypto Module Documentation

## Overview

The `lib/crypto.ts` module provides client-side SHA-256 hash computation for the EXTATE document protection system. All cryptographic operations run in the browser using the Web Crypto API to ensure document privacy.

## Features

- ✅ SHA-256 hash computation using Web Crypto API
- ✅ Browser compatibility checking
- ✅ Comprehensive error handling
- ✅ TypeScript type safety
- ✅ Lowercase hexadecimal output format

## API Reference

### `computeSHA256(file: File): Promise<string>`

Computes the SHA-256 hash of a file.

**Parameters:**
- `file` (File): The file to hash

**Returns:**
- Promise<string>: A 64-character lowercase hexadecimal string

**Throws:**
- `CryptoNotSupportedError`: If Web Crypto API is not available
- `HashComputationError`: If hash computation fails

**Example:**
```typescript
import { computeSHA256 } from '@/lib/crypto';

const file = new File(['content'], 'document.pdf');
const hash = await computeSHA256(file);
console.log(hash); // "ed7002b439e9ac845f22357d822bac1444730fbdb6016d3ec9432297b9ec9f73"
```

### `isCryptoSupported(): boolean`

Checks if the Web Crypto API is available in the current browser.

**Returns:**
- boolean: true if crypto.subtle is available, false otherwise

**Example:**
```typescript
import { isCryptoSupported } from '@/lib/crypto';

if (!isCryptoSupported()) {
  alert('Please use a modern browser');
}
```

### Error Classes

#### `CryptoNotSupportedError`

Thrown when the Web Crypto API is not available in the browser.

**Properties:**
- `name`: "CryptoNotSupportedError"
- `message`: "Web Crypto API is not supported in this browser..."

#### `HashComputationError`

Thrown when hash computation fails.

**Properties:**
- `name`: "HashComputationError"
- `message`: Error description
- `cause`: Original error (if available)

## Testing

### Manual Testing (Browser)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/test-crypto

3. Use the test page to:
   - Check browser compatibility
   - Upload files and compute their hashes
   - Run automated tests

### Unit Testing (Jest)

1. Install testing dependencies:
   ```bash
   npm install --save-dev jest @types/jest ts-jest @testing-library/jest-dom
   ```

2. Add test script to package.json:
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch"
     }
   }
   ```

3. Run tests:
   ```bash
   npm test
   ```

### Test Coverage

The test suite (`lib/__tests__/crypto.test.ts`) includes:

- ✅ Known content hash verification
- ✅ Hash consistency checks
- ✅ Different files produce different hashes
- ✅ Empty file handling
- ✅ Large file handling (1MB+)
- ✅ Binary file handling
- ✅ Error handling for unsupported browsers
- ✅ File reading error handling

## Browser Compatibility

The Web Crypto API is supported in:

- ✅ Chrome 37+
- ✅ Firefox 34+
- ✅ Safari 11+
- ✅ Edge 12+
- ✅ Opera 24+

**Note:** The API requires a secure context (HTTPS or localhost).

## Implementation Details

### Hash Computation Process

1. Read file as ArrayBuffer
2. Compute SHA-256 hash using `crypto.subtle.digest()`
3. Convert hash buffer to Uint8Array
4. Convert bytes to lowercase hexadecimal string
5. Return 64-character hex string

### Security Considerations

- All operations run client-side (no server processing)
- Files never leave the user's browser during hashing
- Uses browser's native cryptographic functions
- Secure context required (HTTPS/localhost)

## Usage in EXTATE

The crypto module is used in two main flows:

### 1. Document Registration (Upload Flow)

```typescript
// In upload form submission
const file = formData.get('file') as File;
const fingerprint = await computeSHA256(file);

// Store fingerprint in database
await supabase.from('documents').insert({
  fingerprint,
  // ... other fields
});
```

### 2. Document Verification

```typescript
// In verification page
const storedFingerprint = document.fingerprint;
const uploadedFile = formData.get('file') as File;
const computedFingerprint = await computeSHA256(uploadedFile);

const isMatch = storedFingerprint === computedFingerprint;
```

## Troubleshooting

### "Web Crypto API is not supported"

**Cause:** Browser doesn't support crypto.subtle or page is not in secure context

**Solution:**
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Ensure page is served over HTTPS or localhost
- Check browser version meets minimum requirements

### "Failed to compute SHA-256 hash"

**Cause:** File reading error or crypto API failure

**Solution:**
- Check file is not corrupted
- Verify file size is reasonable
- Try a different file
- Check browser console for detailed error

## Performance

Hash computation performance varies by file size:

- Small files (<1MB): ~10-50ms
- Medium files (1-10MB): ~50-500ms
- Large files (>10MB): May take several seconds

The Web Crypto API is highly optimized and runs in native code, providing excellent performance for typical document sizes.

## Future Enhancements

Potential improvements for future versions:

- Progress callbacks for large files
- Batch hashing for multiple files
- Support for other hash algorithms (SHA-512, etc.)
- Web Worker support for non-blocking computation
- Streaming hash computation for very large files
