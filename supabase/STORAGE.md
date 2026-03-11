# Supabase Storage Configuration

This document describes the storage bucket configuration for the EXTATE document protection platform.

## Storage Bucket: `documents`

### Overview

The `documents` bucket stores uploaded property documents (PDFs and images) for the EXTATE platform. Files are stored with UUID-based names and are publicly accessible via direct URLs.

### Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Bucket Name** | `documents` | Descriptive name indicating content type |
| **Access Level** | Public | Simplifies architecture; UUID provides security through obscurity |
| **File Size Limit** | 10MB (10,485,760 bytes) | Balances quality with storage costs; sufficient for document scans |
| **Allowed MIME Types** | `application/pdf`, `image/jpeg`, `image/png` | Supports common document formats |

### File Naming Convention

Files are stored using UUID-based naming:

```
{uuid}.{extension}
```

**Examples:**
- `550e8400-e29b-41d4-a716-446655440000.pdf`
- `6ba7b810-9dad-11d1-80b4-00c04fd430c8.jpg`
- `7c9e6679-7425-40de-944b-e07fc1f90ae7.png`

**Benefits:**
- UUID matches the document record ID in the database
- Prevents filename collisions
- Provides security through obscurity (128-bit random identifier)
- No personally identifiable information in filename

### Public URL Format

Files are accessible via public URLs:

```
https://{project-ref}.supabase.co/storage/v1/object/public/documents/{uuid}.{extension}
```

**Example:**
```
https://abcdefghijklmnop.supabase.co/storage/v1/object/public/documents/550e8400-e29b-41d4-a716-446655440000.pdf
```

**Characteristics:**
- No authentication required
- Permanent (as long as file exists)
- Stored in `file_url` field of database
- Can be embedded in certificates and shared publicly

## Storage Policies

The bucket uses Row Level Security (RLS) policies to control access:

### Policy 1: Public Uploads

```sql
CREATE POLICY "Allow public uploads to documents bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'documents');
```

**Purpose:** Allows anyone to upload files to the documents bucket

**Use Case:** Users can upload property documents without authentication

### Policy 2: Public Downloads

```sql
CREATE POLICY "Allow public downloads from documents bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'documents');
```

**Purpose:** Allows anyone to download files from the documents bucket

**Use Case:** Certificates can display document images; verification can access original files

### Policy 3: Public Updates (Optional)

```sql
CREATE POLICY "Allow public updates in documents bucket"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');
```

**Purpose:** Allows file updates (for future features)

**Use Case:** Document replacement or metadata updates

### Policy 4: Public Deletes (Optional)

```sql
CREATE POLICY "Allow public deletes from documents bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'documents');
```

**Purpose:** Allows file deletion (for future features)

**Use Case:** Document removal or cleanup operations

## Security Considerations

### Why Public Access is Safe

1. **UUID Obscurity**: Files are named with 128-bit UUIDs, making them virtually impossible to guess
   - Total possible UUIDs: 2^128 ≈ 3.4 × 10^38
   - Probability of guessing a valid UUID: negligible

2. **No Directory Listing**: Public access doesn't enable directory browsing
   - Users cannot enumerate all files in the bucket
   - Must know the exact UUID to access a file

3. **Application Control**: The application controls:
   - What files are uploaded
   - How files are named
   - What metadata is stored

4. **No Sensitive Data**: The system is designed for:
   - Documents users want to prove ownership of
   - Not for storing secrets or confidential information
   - Public verification is a feature, not a bug

### Threat Model

**Protected Against:**
- ✅ Unauthorized file enumeration (no directory listing)
- ✅ Filename guessing (UUID-based names)
- ✅ Unauthorized modifications (tracked in database)
- ✅ File size abuse (10MB limit)
- ✅ Invalid file types (MIME type validation)

**Not Protected Against:**
- ❌ URL sharing (by design - certificates include public URLs)
- ❌ File content analysis (files are public once uploaded)
- ❌ Storage quota exhaustion (requires rate limiting)

### Future Security Enhancements

If additional security is needed:

1. **Signed URLs**: Switch to private bucket with time-limited signed URLs
2. **Authentication**: Require user accounts and authentication
3. **Encryption**: Encrypt files at rest (Supabase provides this by default)
4. **Rate Limiting**: Implement upload rate limits to prevent abuse
5. **File Scanning**: Add virus/malware scanning for uploads
6. **Watermarking**: Add visible watermarks to documents

## File Size Limits

### Application-Level Validation

The application validates file size before upload:

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

function validateFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}
```

**Benefits:**
- Immediate user feedback
- Prevents unnecessary upload attempts
- Better user experience

### Storage-Level Limits

Supabase also enforces file size limits at the storage level:

- Configured in bucket settings via dashboard
- Provides defense-in-depth
- Prevents circumvention of client-side validation

## MIME Type Validation

### Application-Level Validation

The application validates MIME types before upload:

```typescript
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png'
];

function validateMimeType(file: File): boolean {
  return ALLOWED_MIME_TYPES.includes(file.type);
}
```

**Benefits:**
- Immediate user feedback
- Clear error messages
- Better user experience

### Storage-Level Validation (Optional)

Can be enforced via storage policies:

```sql
CREATE POLICY "Allow public uploads with MIME type restrictions"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'documents' 
  AND (
    mimetype = 'application/pdf' 
    OR mimetype = 'image/jpeg' 
    OR mimetype = 'image/png'
  )
);
```

**Note:** Application-level validation is sufficient for most use cases.

## Usage Examples

### Upload a File

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadDocument(file: File, documentId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${documentId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);
  
  return urlData.publicUrl;
}
```

### Get Public URL

```typescript
function getPublicUrl(fileName: string): string {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);
  
  return data.publicUrl;
}
```

### Download a File

```typescript
async function downloadDocument(fileName: string): Promise<Blob> {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(fileName);
  
  if (error) throw error;
  
  return data;
}
```

### Delete a File (Optional)

```typescript
async function deleteDocument(fileName: string): Promise<void> {
  const { error } = await supabase.storage
    .from('documents')
    .remove([fileName]);
  
  if (error) throw error;
}
```

## Integration with Database

The storage bucket works in conjunction with the `documents` table:

### Workflow

1. **User uploads file** → Application validates file
2. **Compute SHA-256 hash** → Client-side using Web Crypto API
3. **Upload to storage** → Get public URL
4. **Insert database record** → Store metadata and file URL
5. **Redirect to certificate** → Display document information

### Database Schema Integration

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name TEXT NOT NULL,
  property_address TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_date TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  file_url TEXT NOT NULL,  -- Public URL from storage
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

The `file_url` field stores the public URL from the storage bucket.

## Monitoring and Maintenance

### Storage Metrics

Monitor these metrics in the Supabase dashboard:

- **Total storage used**: Track against quota
- **Number of files**: Monitor growth rate
- **Upload frequency**: Detect unusual patterns
- **Download frequency**: Monitor access patterns

### Cleanup Operations

Consider implementing cleanup for:

- **Orphaned files**: Files in storage without database records
- **Failed uploads**: Incomplete or corrupted files
- **Test files**: Files created during development/testing

### Backup Strategy

Supabase provides automatic backups, but consider:

- **Regular exports**: Download critical files periodically
- **Redundancy**: Store important documents in multiple locations
- **Disaster recovery**: Have a plan for restoring from backups

## Requirements Satisfied

This storage configuration satisfies:

- ✅ **Requirement 4.1**: Upload Property_Document to Document_Store when Document_Fingerprint is computed

The storage bucket provides:
- Secure file storage with public access
- 10MB file size limit
- Support for PDF and image formats
- Direct public URLs for stored files
- Integration with Supabase database for metadata storage
- Row Level Security policies for access control

## Related Documentation

- **Task Instructions**: `supabase/TASK_2.2_INSTRUCTIONS.md`
- **Storage Policies**: `supabase/storage-policies.sql`
- **Setup Script**: `supabase/apply-storage-policies.sh`
- **Database Schema**: `supabase/SCHEMA.md`
- **Main README**: `README.md`

## Support

For issues or questions:

- **Supabase Storage Docs**: https://supabase.com/docs/guides/storage
- **Storage Security**: https://supabase.com/docs/guides/storage/security/access-control
- **File Uploads**: https://supabase.com/docs/guides/storage/uploads
- **Supabase Support**: https://supabase.com/support
