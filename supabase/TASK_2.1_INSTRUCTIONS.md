# Task 2.1: Database Table Creation - Instructions

## Overview

This document provides step-by-step instructions for creating the Supabase database table for the EXTATE document protection platform.

## What Was Created

Task 2.1 has created the following files:

1. **`supabase/migrations/001_create_documents_table.sql`** - The main migration file
2. **`supabase/README.md`** - General migration documentation
3. **`supabase/SCHEMA.md`** - Detailed schema documentation
4. **`supabase/verify-migration.sql`** - Verification script
5. **`supabase/apply-migration.sh`** - Interactive migration helper script

## Quick Start

### Option 1: Interactive Script (Easiest)

Run the interactive migration script:

```bash
bash supabase/apply-migration.sh
```

This will guide you through the process.

### Option 2: Manual Application (Recommended)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_create_documents_table.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see a success message

### Option 3: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project (first time only)
supabase link --project-ref your-project-ref

# Apply the migration
supabase db push
```

## Verification

After applying the migration, verify it worked:

### Method 1: Using the Verification Script

1. Go to Supabase SQL Editor
2. Copy contents of `supabase/verify-migration.sql`
3. Paste and run
4. Check that all tests show "✓ PASS"

### Method 2: Manual Check

Run this query in the SQL Editor:

```sql
SELECT * FROM documents LIMIT 1;
```

If the table exists, you'll see column headers (even with no data).

### Method 3: Check in Dashboard

1. Go to **Table Editor** in Supabase dashboard
2. Look for the `documents` table in the list
3. Click on it to see the schema

## What the Migration Creates

### Table: `documents`

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| id | UUID | PRIMARY KEY, NOT NULL | gen_random_uuid() |
| owner_name | TEXT | NOT NULL | - |
| property_address | TEXT | NOT NULL | - |
| document_type | TEXT | NOT NULL | - |
| document_date | TEXT | NOT NULL | - |
| fingerprint | TEXT | NOT NULL | - |
| file_url | TEXT | NOT NULL | - |
| created_at | TIMESTAMPTZ | NOT NULL | NOW() |

### Index: `idx_documents_fingerprint`

An index on the `fingerprint` column for fast verification lookups.

## Requirements Satisfied

This migration satisfies all requirements from Requirement 10:

- ✅ **10.1**: UUID primary key
- ✅ **10.2**: owner_name field (TEXT)
- ✅ **10.3**: property_address field (TEXT)
- ✅ **10.4**: document_type field (TEXT)
- ✅ **10.5**: document_date field (TEXT)
- ✅ **10.6**: fingerprint field (TEXT)
- ✅ **10.7**: file_url field (TEXT)
- ✅ **10.8**: created_at field (TIMESTAMPTZ)
- ✅ **10.9**: Automatic UUID generation (DEFAULT gen_random_uuid())
- ✅ **10.10**: Automatic timestamp (DEFAULT NOW())

## Troubleshooting

### Error: "relation 'documents' already exists"

The table has already been created. You can either:
- Skip this step (table already exists)
- Drop the existing table first: `DROP TABLE documents;` (⚠️ This will delete all data!)

### Error: "permission denied"

Make sure you're using the correct Supabase credentials and have admin access to the project.

### Error: "function gen_random_uuid() does not exist"

This is rare but can happen. Run this first:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

Then run the migration again.

## Next Steps

After successfully creating the table:

1. ✅ Verify the table exists (see Verification section above)
2. 📦 Set up the Supabase Storage bucket (see main README.md)
3. 🔧 Configure environment variables in `.env.local`
4. 🚀 Start implementing the upload functionality (Task 2.2)

## Additional Resources

- **Schema Documentation**: See `supabase/SCHEMA.md` for detailed schema information
- **Migration Guide**: See `supabase/README.md` for general migration information
- **Main README**: See root `README.md` for complete setup instructions

## Support

If you encounter issues:

1. Check the Supabase dashboard for error messages
2. Review the SQL syntax in the migration file
3. Consult the Supabase documentation: https://supabase.com/docs
4. Check that your Supabase project is active and accessible

---

**Task 2.1 Status**: ✅ Complete

The database schema has been created and is ready for use. The table structure matches the design specification and satisfies all requirements.
