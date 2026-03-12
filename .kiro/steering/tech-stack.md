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
