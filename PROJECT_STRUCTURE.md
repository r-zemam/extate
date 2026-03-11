# EXTATE Project Structure

This document describes the complete project structure for the EXTATE Document Protection platform.

## Directory Structure

```
extate-document-protection/
├── .kiro/                          # Kiro specification files
│   └── specs/
│       └── extate-document-protection/
│           ├── .config.kiro        # Spec configuration
│           ├── requirements.md     # Requirements document
│           ├── design.md          # Design document
│           └── tasks.md           # Task list
│
├── app/                           # Next.js App Router pages
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Landing page (/)
│   ├── globals.css               # Global styles with Tailwind
│   ├── upload/
│   │   └── page.tsx             # Document upload page (/upload)
│   ├── certificate/
│   │   └── [id]/
│   │       └── page.tsx         # Certificate display (/certificate/[id])
│   └── verify/
│       └── [id]/
│           └── page.tsx         # Verification page (/verify/[id])
│
├── components/                    # React components (to be added)
│   └── .gitkeep
│
├── lib/                          # Utility functions and configurations
│   └── supabase.ts              # Supabase client setup
│
├── public/                       # Static assets (images, fonts, etc.)
│   └── .gitkeep
│
├── .env.local                    # Environment variables (not in git)
├── .env.example                  # Environment variables template
├── .eslintrc.json               # ESLint configuration
├── .gitignore                   # Git ignore rules
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── README.md                    # Project documentation
├── SETUP.md                     # Setup instructions
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## Configuration Files

### package.json
Contains all project dependencies:
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **@supabase/supabase-js**: Supabase client library
- **jsPDF**: PDF generation library

### tsconfig.json
TypeScript configuration with:
- Strict mode enabled
- Path aliases (@/* for root imports)
- Next.js plugin integration

### tailwind.config.ts
Custom Tailwind configuration with certificate design colors:
- `certificate-cream`: #FFF8E7
- `certificate-off-white`: #FAF7F0
- `certificate-dark-text`: #1a1a1a
- `certificate-deep-blue`: #1e3a5f
- `certificate-burgundy`: #6b2737
- `certificate-forest-green`: #2d5016
- `certificate-gold`: #d4af37
- `certificate-bronze`: #cd7f32

### .env.local
Environment variables for Supabase:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Page Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Landing page with service introduction |
| `/upload` | `app/upload/page.tsx` | Document upload form |
| `/certificate/[id]` | `app/certificate/[id]/page.tsx` | Certificate display and download |
| `/verify/[id]` | `app/verify/[id]/page.tsx` | Document verification interface |

## Key Features

### 1. App Router Structure
- Uses Next.js 14 App Router (not Pages Router)
- Server Components by default
- File-based routing with dynamic segments

### 2. TypeScript Integration
- Full TypeScript support
- Type-safe API calls
- Strict mode enabled

### 3. Tailwind CSS
- Utility-first styling
- Custom color palette for certificates
- Responsive design utilities

### 4. Supabase Integration
- Client library configured in `lib/supabase.ts`
- Environment variables for credentials
- Ready for database and storage operations

### 5. PDF Generation
- jsPDF library installed
- Ready for certificate PDF generation

## Next Steps

After completing Task 1 (project setup), the following tasks will implement:

1. **Task 2**: Landing page with service explanation
2. **Task 3**: Document upload form with file input and metadata fields
3. **Task 4**: Client-side SHA-256 hash generation using Web Crypto API
4. **Task 5**: Document storage and database registration
5. **Task 6**: Certificate display with official document design
6. **Task 7**: PDF certificate generation and download
7. **Task 8**: Document verification interface
8. **Task 9**: Verification result display with visual indicators
9. **Task 10**: Testing and validation

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Important Notes

1. **Node.js Required**: This project requires Node.js 18.x or higher
2. **Supabase Setup**: Database and storage must be configured before running
3. **Environment Variables**: Must be set in `.env.local` before development
4. **Public Storage**: The documents bucket must be set to public access
5. **Browser Compatibility**: Web Crypto API requires modern browsers

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
