# EXTATE Tech Stack

## Core Technologies

- **Next.js 14** - App Router (not Pages Router)
- **TypeScript** - Strict mode enabled
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Database (PostgreSQL) and Storage
- **jsPDF** - PDF certificate generation
- **Web Crypto API** - SHA-256 hashing (client-side)

## Architecture Principles

### Server Actions
- Always use Next.js server actions for database calls
- Mark functions with `'use server'` directive
- Keep server actions in `lib/actions.ts`
- Never expose Supabase client directly to client components

### Component Structure
- Keep components flat with no unnecessary abstraction
- Avoid over-engineering with complex component hierarchies
- Co-locate related functionality
- Use client components (`'use client'`) only when needed for interactivity

### File Organization
```
app/                    # Next.js App Router pages
  [route]/
    page.tsx           # Route page component
    __tests__/         # Tests for this route
lib/                   # Shared utilities and server actions
  actions.ts           # Server actions for database
  crypto.ts            # Client-side crypto utilities
  validation.ts        # Validation logic
  formatting.ts        # Date and label formatting
  pdf-generator.ts     # PDF generation
  supabase.ts          # Supabase client initialization
components/            # Shared React components (minimal)
supabase/              # Database migrations and policies
```

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.39.0",
    "jspdf": "^2.5.1"
  }
}
```

## Database & Storage

- **Database**: Supabase PostgreSQL
  - Table: `documents` (stores metadata and fingerprints)
  - Row Level Security (RLS) policies for public access
  
- **Storage**: Supabase Storage bucket
  - Bucket name: `documents`
  - Public access enabled
  - Files named with UUIDs for security

## Client-Side Processing

- SHA-256 hashing happens in the browser using Web Crypto API
- File validation (size, type) happens client-side before upload
- No sensitive operations on the server that can be done client-side

## Styling Approach

- Tailwind CSS for all styling
- No CSS modules or styled-components
- Use Tailwind's built-in responsive utilities
- Custom colors defined in `tailwind.config.ts` for certificate styling

## Performance Considerations

- Server components by default (faster initial load)
- Client components only for interactivity (forms, buttons, state)
- Static generation where possible
- Optimize images with Next.js Image component (if needed)

## Security

- Environment variables for Supabase credentials
- Public Supabase anon key is safe (RLS policies protect data)
- UUID-based file naming prevents enumeration
- Client-side hashing ensures file integrity

## Design Decisions and Trade-offs

### Why Next.js 14 App Router
- Server components by default reduce client-side JavaScript
- Built-in server actions eliminate the need for a separate API layer
- File-based routing maps cleanly to the 4-page structure
- Vercel deployment is zero-config

### Why Supabase over Firebase or raw AWS RDS
- PostgreSQL gives us proper relational data with UUID primary keys
- Built-in Storage bucket handles file uploads without S3 configuration
- Row Level Security (RLS) policies provide access control at the database level
- Free tier is sufficient for a prototype/hackathon scope
- Single service for both database and file storage reduces complexity

### Why Client-Side SHA-256 Hashing
- **Privacy**: The document never leaves the browser unencrypted — the server only ever sees the hash
- **Performance**: No server round-trip for the most compute-intensive step
- **Trust**: Users can verify the hashing happens locally by inspecting the source
- Web Crypto API is available in all modern browsers natively (no library needed)

### Why No Authentication
- **Accessibility**: No account means any family member, lawyer, or official can verify a document
- **Simplicity**: Reduces friction for users with limited technical literacy
- **Scope**: For a prototype, public verification is the core value proposition
- Trade-off: Anyone with a certificate ID can view the registration — acceptable given documents are identified only by UUID

### Why Public Storage Bucket
- Simplifies architecture: direct public URLs stored in database, no signed URL generation
- Trade-off: Files are technically accessible by URL — mitigated by UUID-based naming (no enumeration)
- Acceptable for a prototype; production would use signed URLs with expiry

### Why No Blockchain for v1
- Adds significant complexity (wallet management, gas fees, network choice)
- Timeline trade-off: core value (cryptographic proof + permanent record) is achievable without it
- Supabase database provides the permanent record for v1
- Ethereum/Polygon anchoring is the natural v2 enhancement for truly trustless verification

### Certificate ID Format
- Raw UUIDs (`3f2504e0-4f89-11d3-9a0c-0305e82c3301`) are hard to read and share verbally
- `EXTATE-3F25-04E0` format is memorable, brandable, and still unique enough for a prototype
- Derived from first 8 hex characters of the UUID
