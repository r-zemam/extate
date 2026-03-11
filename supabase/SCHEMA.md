# Database Schema Documentation

## Overview

The EXTATE document protection platform uses a single table to store document metadata and cryptographic fingerprints.

## Tables

### `documents`

Stores property document metadata and SHA-256 fingerprints for verification.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Unique identifier (auto-generated) |
| `owner_name` | TEXT | NO | - | Full name of property owner |
| `property_address` | TEXT | NO | - | Physical address of property |
| `document_type` | TEXT | NO | - | Type: deed, title, inheritance_record, or tax_document |
| `document_date` | TEXT | NO | - | Date on the original document |
| `fingerprint` | TEXT | NO | - | SHA-256 hash (64-character hex string) |
| `file_url` | TEXT | NO | - | Supabase Storage public URL |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | Registration timestamp (auto-generated) |

### Indexes

- **Primary Key**: `id` (UUID)
- **idx_documents_fingerprint**: Index on `fingerprint` field for efficient verification lookups

## Document Types

The `document_type` field accepts the following values:

- `deed` - Property deed
- `title` - Property title
- `inheritance_record` - Inheritance documentation
- `tax_document` - Tax-related property document

## Fingerprint Format

The `fingerprint` field stores SHA-256 hashes in lowercase hexadecimal format:
- Length: 64 characters
- Character set: `[a-f0-9]`
- Example: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

## Storage Integration

The `file_url` field contains public URLs from the Supabase Storage `documents` bucket:
- Format: `https://{project-ref}.supabase.co/storage/v1/object/public/documents/{uuid}.{ext}`
- Files are publicly accessible (no authentication required)
- Supported formats: PDF, JPEG, PNG

## Example Record

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "owner_name": "John Doe",
  "property_address": "123 Main Street, Springfield",
  "document_type": "deed",
  "document_date": "2024-01-15",
  "fingerprint": "a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890",
  "file_url": "https://project.supabase.co/storage/v1/object/public/documents/550e8400-e29b-41d4-a716-446655440000.pdf",
  "created_at": "2024-01-20T10:30:00.000Z"
}
```

## Requirements Mapping

This schema satisfies the following requirements from the specification:

| Requirement | Field/Feature | Description |
|-------------|---------------|-------------|
| 10.1 | `id` (UUID) | Unique identifier as primary key |
| 10.2 | `owner_name` | Owner name as text |
| 10.3 | `property_address` | Property address as text |
| 10.4 | `document_type` | Document type as text |
| 10.5 | `document_date` | Document date as text |
| 10.6 | `fingerprint` | SHA-256 fingerprint as text |
| 10.7 | `file_url` | File URL as text |
| 10.8 | `created_at` | Timestamp with timezone |
| 10.9 | `DEFAULT gen_random_uuid()` | Automatic UUID generation |
| 10.10 | `DEFAULT NOW()` | Automatic timestamp generation |

## Query Examples

### Insert a new document record

```sql
INSERT INTO documents (
  owner_name, 
  property_address, 
  document_type, 
  document_date, 
  fingerprint, 
  file_url
) VALUES (
  'John Doe',
  '123 Main Street, Springfield',
  'deed',
  '2024-01-15',
  'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890',
  'https://project.supabase.co/storage/v1/object/public/documents/file.pdf'
) RETURNING *;
```

### Retrieve a document by ID

```sql
SELECT * FROM documents WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

### Verify a document by fingerprint

```sql
SELECT * FROM documents WHERE fingerprint = 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890';
```

### Get all documents for an owner

```sql
SELECT * FROM documents 
WHERE owner_name = 'John Doe' 
ORDER BY created_at DESC;
```

### Count documents by type

```sql
SELECT document_type, COUNT(*) as count 
FROM documents 
GROUP BY document_type 
ORDER BY count DESC;
```

## Security Considerations

1. **Public Access**: The `documents` table should have appropriate Row Level Security (RLS) policies if needed
2. **File URLs**: Files are publicly accessible via UUID-based URLs (security through obscurity)
3. **Fingerprint Uniqueness**: While not enforced at the database level, fingerprints should be unique per document
4. **Input Validation**: Application layer should validate all inputs before insertion

## Maintenance

### Backup Recommendations

- Regular automated backups via Supabase
- Export critical data periodically
- Test restore procedures

### Monitoring

- Monitor table size growth
- Track index performance on `fingerprint` lookups
- Monitor storage bucket usage

### Future Considerations

Potential schema enhancements (not currently implemented):

- Add `updated_at` timestamp for tracking modifications
- Add `status` field for document lifecycle management
- Add `verified_count` to track verification attempts
- Add foreign key to `users` table if authentication is added
- Add `metadata` JSONB field for extensibility
