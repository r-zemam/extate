-- Verification script to check if the documents table was created correctly
-- Run this in the Supabase SQL Editor to verify the migration

-- Check if the documents table exists
SELECT 
    'documents table exists' AS check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'documents'
        ) THEN '✓ PASS'
        ELSE '✗ FAIL'
    END AS status;

-- Check all required columns exist with correct types
SELECT 
    'All columns exist with correct types' AS check_name,
    CASE 
        WHEN (
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_name = 'documents' 
            AND column_name IN (
                'id', 'owner_name', 'property_address', 
                'document_type', 'document_date', 'fingerprint', 
                'file_url', 'created_at'
            )
        ) = 8 THEN '✓ PASS'
        ELSE '✗ FAIL'
    END AS status;

-- Check UUID primary key with default
SELECT 
    'id column is UUID with default' AS check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'documents' 
            AND column_name = 'id'
            AND data_type = 'uuid'
            AND column_default LIKE '%gen_random_uuid%'
        ) THEN '✓ PASS'
        ELSE '✗ FAIL'
    END AS status;

-- Check created_at has default NOW()
SELECT 
    'created_at has default NOW()' AS check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'documents' 
            AND column_name = 'created_at'
            AND data_type = 'timestamp with time zone'
            AND column_default IS NOT NULL
        ) THEN '✓ PASS'
        ELSE '✗ FAIL'
    END AS status;

-- Check fingerprint index exists
SELECT 
    'fingerprint index exists' AS check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM pg_indexes 
            WHERE tablename = 'documents' 
            AND indexname = 'idx_documents_fingerprint'
        ) THEN '✓ PASS'
        ELSE '✗ FAIL'
    END AS status;

-- Display table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'documents'
ORDER BY ordinal_position;
