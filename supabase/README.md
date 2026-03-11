# Supabase Database Migrations and Storage

This directory contains SQL migration files and storage configuration for the EXTATE document protection platform.

## Contents

### Database Migrations

- **`migrations/001_create_documents_table.sql`** - Creates the documents table
- **`SCHEMA.md`** - Detailed database schema documentation
- **`verify-migration.sql`** - Database verification queries
- **`apply-migration.sh`** - Interactive migration helper script

### Storage Configuration

- **`storage-policies.sql`** - Storage bucket RLS policies
- **`STORAGE.md`** - Detailed storage configuration documentation
- **`STORAGE_QUICK_START.md`** - Quick setup guide for storage bucket
- **`apply-storage-policies.sh`** - Interactive storage setup script

### Task Documentation

- **`TASK_2.1_INSTRUCTIONS.md`** - Database table setup instructions
- **`TASK_2.2_INSTRUCTIONS.md`** - Storage bucket setup instructions

## Migrations

### 001_create_documents_table.sql

Creates the `documents` table with the following schema:

- `id` (UUID, Primary Key): Auto-generated unique identifier
- `owner_name` (TEXT): Full name of property owner
- `property_address` (TEXT): Physical address of property
- `document_type` (TEXT): Type of document (deed, title, inheritance_record, tax_document)
- `document_date` (TEXT): Date on the original document
- `fingerprint` (TEXT): SHA-256 hash (64-character hex string)
- `file_url` (TEXT): Supabase Storage public URL
- `created_at` (TIMESTAMPTZ): Registration timestamp (auto-generated)

Also creates an index on the `fingerprint` field for efficient verification lookups.

## Storage Configuration

### Bucket: documents

The `documents` storage bucket stores uploaded property documents:

- **Access**: Public (UUID-based security)
- **File Size Limit**: 10MB
- **Allowed Types**: PDF, JPEG, PNG
- **Naming**: `{uuid}.{extension}`

See `STORAGE.md` for detailed configuration information.

## How to Apply Migrations

### Database Migration

### Option 1: Using Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `001_create_documents_table.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Option 3: Manual Execution

You can also execute the SQL directly using any PostgreSQL client connected to your Supabase database.

### Storage Setup

See `STORAGE_QUICK_START.md` for quick setup or `TASK_2.2_INSTRUCTIONS.md` for detailed instructions.

**Quick method:**

```bash
bash supabase/apply-storage-policies.sh
```

## Verification

After applying the migration, verify the table was created:

```sql
-- Check table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'documents';

-- Check table structure
\d documents

-- Check index exists
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'documents';
```

## Requirements Satisfied

This migration satisfies the following requirements from the spec:

### Database (Task 2.1)

- **Requirement 10.1**: UUID primary key
- **Requirement 10.2**: owner_name field
- **Requirement 10.3**: property_address field
- **Requirement 10.4**: document_type field
- **Requirement 10.5**: document_date field
- **Requirement 10.6**: fingerprint field
- **Requirement 10.7**: file_url field
- **Requirement 10.8**: created_at timestamp with timezone
- **Requirement 10.9**: Automatic UUID generation
- **Requirement 10.10**: Automatic timestamp generation

The index on `fingerprint` enables efficient document verification lookups.

### Storage (Task 2.2)

- **Requirement 4.1**: Upload Property_Document to Document_Store when Document_Fingerprint is computed

The storage bucket provides secure file storage with public access, 10MB file size limit, and support for PDF and image formats.

## Documentation

- **`SCHEMA.md`** - Detailed database schema and field descriptions
- **`STORAGE.md`** - Detailed storage configuration and security considerations
- **`TASK_2.1_INSTRUCTIONS.md`** - Step-by-step database setup guide
- **`TASK_2.2_INSTRUCTIONS.md`** - Step-by-step storage setup guide
- **`STORAGE_QUICK_START.md`** - Quick reference for storage setup
