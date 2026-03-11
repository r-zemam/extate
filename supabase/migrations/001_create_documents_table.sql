-- Create documents table for storing property document metadata and fingerprints
-- This table is the core of the EXTATE document protection system

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name TEXT NOT NULL,
  property_address TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_date TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on fingerprint field for efficient verification lookups
CREATE INDEX idx_documents_fingerprint ON documents(fingerprint);

-- Add comments to document the schema
COMMENT ON TABLE documents IS 'Stores property document metadata and SHA-256 fingerprints for verification';
COMMENT ON COLUMN documents.id IS 'Unique identifier (auto-generated UUID)';
COMMENT ON COLUMN documents.owner_name IS 'Full name of property owner';
COMMENT ON COLUMN documents.property_address IS 'Physical address of property';
COMMENT ON COLUMN documents.document_type IS 'Type of document: deed, title, inheritance_record, or tax_document';
COMMENT ON COLUMN documents.document_date IS 'Date on the original document';
COMMENT ON COLUMN documents.fingerprint IS 'SHA-256 hash (64-character hex string)';
COMMENT ON COLUMN documents.file_url IS 'Supabase Storage public URL for the uploaded file';
COMMENT ON COLUMN documents.created_at IS 'Registration timestamp (auto-generated)';
