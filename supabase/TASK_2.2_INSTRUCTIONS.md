# Task 2.2: Storage Bucket Creation - Instructions

## Overview

This document provides step-by-step instructions for creating the Supabase storage bucket for the EXTATE document protection platform.

## What You Need to Create

Task 2.2 requires setting up a Supabase Storage bucket with the following specifications:

- **Bucket Name**: `documents`
- **Access Level**: Public (for simplified architecture)
- **File Size Limit**: 10MB maximum
- **Allowed MIME Types**: 
  - `application/pdf` (PDF documents)
  - `image/jpeg` (JPEG images)
  - `image/png` (PNG images)

## Why Public Access?

The design document specifies public access for the storage bucket. This decision is based on:

1. **UUID Obscurity**: Documents are identified only by UUID, providing sufficient security through obscurity
2. **Simplified Architecture**: Public access eliminates the need for signed URL generation
3. **Direct URLs**: Public URLs can be stored directly in the database without authentication flows
4. **User Experience**: Faster access without additional authentication overhead

## Step-by-Step Setup Instructions

### Step 1: Access Supabase Storage

1. Open your Supabase project dashboard at https://supabase.com
2. Select your EXTATE project
3. Click on **Storage** in the left sidebar
4. You should see the Storage management interface

### Step 2: Create the Bucket

1. Click the **"New bucket"** or **"Create a new bucket"** button
2. In the bucket creation dialog:
   - **Name**: Enter `documents` (exactly as shown, lowercase)
   - **Public bucket**: Toggle this **ON** (very important!)
   - **File size limit**: Set to `10485760` bytes (10MB)
   - **Allowed MIME types**: Leave default or configure in policies (next step)
3. Click **"Create bucket"** to confirm

### Step 3: Configure Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies for uploads and downloads.

#### Option A: Using the Dashboard (Recommended)

1. Click on the `documents` bucket you just created
2. Go to the **"Policies"** tab
3. Click **"New Policy"**

**Policy 1: Allow Public Uploads**

- **Policy name**: `Allow public uploads`
- **Allowed operation**: `INSERT`
- **Target roles**: `public`
- **Policy definition**: 
  ```sql
  true
  ```
- Click **"Review"** then **"Save policy"**

**Policy 2: Allow Public Downloads**

- Click **"New Policy"** again
- **Policy name**: `Allow public downloads`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: 
  ```sql
  true
  ```
- Click **"Review"** then **"Save policy"**

**Policy 3: Allow Public Updates** (Optional, for future features)

- Click **"New Policy"** again
- **Policy name**: `Allow public updates`
- **Allowed operation**: `UPDATE`
- **Target roles**: `public`
- **Policy definition**: 
  ```sql
  true
  ```
- Click **"Review"** then **"Save policy"**

#### Option B: Using SQL Editor

Alternatively, you can create policies using SQL:

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Copy and paste the following SQL:

```sql
-- Enable RLS on the storage.objects table for the documents bucket
-- Note: Storage policies are applied to storage.objects table

-- Policy for public uploads (INSERT)
CREATE POLICY "Allow public uploads to documents bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'documents');

-- Policy for public downloads (SELECT)
CREATE POLICY "Allow public downloads from documents bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'documents');

-- Policy for public updates (UPDATE) - Optional
CREATE POLICY "Allow public updates in documents bucket"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- Policy for public deletes (DELETE) - Optional, for future features
CREATE POLICY "Allow public deletes from documents bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'documents');
```

4. Click **"Run"** to execute the SQL

### Step 4: Configure MIME Type Restrictions (Optional)

To enforce MIME type restrictions at the storage level:

1. Go to **Storage** > **Policies**
2. Modify the upload policy to include MIME type checking:

```sql
CREATE POLICY "Allow public uploads with MIME type restrictions"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'documents' 
  AND (
    (storage.foldername(name))[1] = 'documents'
  )
  AND (
    mimetype = 'application/pdf' 
    OR mimetype = 'image/jpeg' 
    OR mimetype = 'image/png'
  )
);
```

**Note**: MIME type validation is also implemented in the application code for better user experience, so this step is optional.

### Step 5: Verify the Bucket Configuration

1. Go to **Storage** in your Supabase dashboard
2. Click on the `documents` bucket
3. Verify the following:
   - ✅ Bucket name is `documents`
   - ✅ Public access is enabled (you should see a "Public" badge)
   - ✅ Policies are created (check the Policies tab)

## Testing the Storage Bucket

### Test Upload (Manual)

1. In the Supabase dashboard, go to **Storage** > **documents** bucket
2. Click **"Upload file"**
3. Select a test PDF or image file (under 10MB)
4. Upload the file
5. You should see the file appear in the bucket
6. Click on the file to get its public URL
7. Copy the URL and paste it in a new browser tab
8. The file should be accessible without authentication

### Test Upload (Using Code)

Create a test file `supabase/test-storage.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

// Replace with your actual credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorageUpload() {
  try {
    // Create a test file
    const testContent = 'This is a test document for EXTATE storage';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    
    // Upload to storage
    const fileName = `test-${Date.now()}.txt`;
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, testFile, {
        contentType: 'text/plain',
        upsert: false
      });

    if (error) {
      console.error('❌ Upload failed:', error.message);
      return;
    }

    console.log('✅ Upload successful!');
    console.log('File path:', data.path);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    console.log('Public URL:', urlData.publicUrl);
    console.log('\n✅ Storage bucket is working correctly!');

  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testStorageUpload();
```

Run the test:

```bash
node supabase/test-storage.js
```

## Requirements Satisfied

This storage bucket setup satisfies the following requirement:

- ✅ **Requirement 4.1**: Upload Property_Document to Document_Store when Document_Fingerprint is computed

The storage bucket provides:
- Secure file storage with public access
- 10MB file size limit (enforced at application level)
- Support for PDF and image formats
- Direct public URLs for stored files
- Integration with Supabase database for metadata storage

## File Path Structure

Files in the storage bucket will be stored with the following naming convention:

```
{uuid}.{extension}
```

Examples:
- `550e8400-e29b-41d4-a716-446655440000.pdf`
- `6ba7b810-9dad-11d1-80b4-00c04fd430c8.jpg`
- `7c9e6679-7425-40de-944b-e07fc1f90ae7.png`

The UUID is generated by the application and matches the document record ID in the database.

## Storage URL Format

Public URLs will follow this format:

```
https://{project-ref}.supabase.co/storage/v1/object/public/documents/{uuid}.{extension}
```

These URLs are:
- Publicly accessible (no authentication required)
- Permanent (as long as the file exists)
- Stored in the `file_url` field of the database

## Troubleshooting

### Error: "Bucket already exists"

The bucket has already been created. You can either:
- Skip this step (bucket already exists)
- Delete the existing bucket and recreate it (⚠️ This will delete all files!)

### Error: "Permission denied" when uploading

Check the following:
1. Bucket is set to **public** access
2. Storage policies are correctly configured
3. You're using the correct Supabase credentials
4. The bucket name is exactly `documents` (lowercase)

### Error: "File size exceeds limit"

The file you're trying to upload is larger than 10MB. The application will validate this before upload, but you can also configure bucket-level limits in Supabase.

### Files not accessible via public URL

1. Verify the bucket is set to **public** (not private)
2. Check that the public download policy is created
3. Ensure the URL format is correct
4. Try accessing the file directly in the Supabase dashboard first

### MIME type validation not working

MIME type validation is primarily handled at the application level. If you need storage-level validation, use the SQL policy with MIME type checking (see Step 4).

## Security Considerations

### Why Public Access is Safe

1. **UUID Obscurity**: Files are named with UUIDs (128-bit random identifiers), making them virtually impossible to guess
2. **No Directory Listing**: Public access doesn't mean directory listing; users can't browse all files
3. **Application Control**: The application controls what gets uploaded and how files are named
4. **No Sensitive Data**: The system is designed for documents that users want to prove ownership of, not for storing secrets

### Additional Security Measures (Optional)

If you need additional security in the future, consider:

1. **Signed URLs**: Switch to private bucket and generate signed URLs with expiration
2. **Authentication**: Require user authentication before allowing uploads
3. **Rate Limiting**: Implement rate limiting on uploads to prevent abuse
4. **File Scanning**: Add virus/malware scanning for uploaded files
5. **Watermarking**: Add watermarks to uploaded documents

## Next Steps

After successfully creating the storage bucket:

1. ✅ Verify the bucket exists and is public
2. ✅ Test file upload and public URL access
3. 🔧 Update application code to use the storage bucket
4. 🚀 Implement the document upload flow (Task 3)

## Additional Resources

- **Supabase Storage Documentation**: https://supabase.com/docs/guides/storage
- **Storage Policies Guide**: https://supabase.com/docs/guides/storage/security/access-control
- **File Upload Best Practices**: https://supabase.com/docs/guides/storage/uploads
- **Main README**: See root `README.md` for complete setup instructions

## Support

If you encounter issues:

1. Check the Supabase dashboard for error messages
2. Verify bucket configuration and policies
3. Test with a small file first (< 1MB)
4. Consult the Supabase documentation
5. Check that your Supabase project is active and accessible

---

**Task 2.2 Status**: ✅ Ready for Implementation

This document provides all the information needed to set up the Supabase storage bucket. Follow the steps above to create the bucket and configure it for the EXTATE document protection platform.
