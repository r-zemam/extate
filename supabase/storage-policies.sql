-- ============================================================================
-- EXTATE Document Protection Platform
-- Storage Bucket Policies Configuration
-- ============================================================================
--
-- This file contains SQL commands to configure Row Level Security (RLS)
-- policies for the Supabase storage bucket.
--
-- IMPORTANT: The storage bucket must be created first through the Supabase
-- dashboard before running these policies.
--
-- Bucket Configuration:
--   - Name: documents
--   - Access: Public
--   - File Size Limit: 10MB
--   - Allowed MIME Types: application/pdf, image/jpeg, image/png
--
-- ============================================================================

-- Policy 1: Allow public uploads to documents bucket
-- This policy allows anyone to upload files to the documents bucket
CREATE POLICY "Allow public uploads to documents bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'documents');

-- Policy 2: Allow public downloads from documents bucket
-- This policy allows anyone to download files from the documents bucket
CREATE POLICY "Allow public downloads from documents bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'documents');

-- Policy 3: Allow public updates in documents bucket (Optional)
-- This policy allows anyone to update files in the documents bucket
-- Uncomment if you need update functionality in the future
CREATE POLICY "Allow public updates in documents bucket"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- Policy 4: Allow public deletes from documents bucket (Optional)
-- This policy allows anyone to delete files from the documents bucket
-- Uncomment if you need delete functionality in the future
CREATE POLICY "Allow public deletes from documents bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'documents');

-- ============================================================================
-- MIME Type Validation (Optional)
-- ============================================================================
--
-- If you want to enforce MIME type restrictions at the storage level,
-- you can replace the upload policy with this more restrictive version:
--
-- DROP POLICY IF EXISTS "Allow public uploads to documents bucket" ON storage.objects;
--
-- CREATE POLICY "Allow public uploads with MIME type restrictions"
-- ON storage.objects
-- FOR INSERT
-- TO public
-- WITH CHECK (
--   bucket_id = 'documents' 
--   AND (
--     mimetype = 'application/pdf' 
--     OR mimetype = 'image/jpeg' 
--     OR mimetype = 'image/png'
--   )
-- );
--
-- Note: MIME type validation is also implemented in the application code
-- for better user experience, so this storage-level validation is optional.
--
-- ============================================================================

-- ============================================================================
-- File Size Limit (Optional)
-- ============================================================================
--
-- Supabase doesn't provide a direct SQL way to enforce file size limits.
-- File size limits should be:
-- 1. Configured in the bucket settings via the dashboard
-- 2. Validated in the application code before upload
--
-- The application enforces a 10MB limit as specified in the requirements.
--
-- ============================================================================

-- ============================================================================
-- Verification Queries
-- ============================================================================
--
-- After applying these policies, verify they were created correctly:
--

-- Check all policies for the storage.objects table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
ORDER BY policyname;

-- Check if the documents bucket exists
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE name = 'documents';

-- ============================================================================
-- Cleanup (Use with caution!)
-- ============================================================================
--
-- If you need to remove the policies and start over:
--
-- DROP POLICY IF EXISTS "Allow public uploads to documents bucket" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public downloads from documents bucket" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public updates in documents bucket" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public deletes from documents bucket" ON storage.objects;
--
-- WARNING: This will remove access to the storage bucket!
--
-- ============================================================================

-- ============================================================================
-- Requirements Satisfied
-- ============================================================================
--
-- This configuration satisfies:
-- - Requirement 4.1: Upload Property_Document to Document_Store
--
-- The storage bucket provides:
-- - Public access for simplified architecture
-- - Support for PDF and image formats
-- - Integration with Supabase database
-- - Direct public URLs for stored files
--
-- ============================================================================
