# EXTATE - Document Protection Platform

A web-based document protection platform that provides cryptographic proof of property ownership for families in developing countries. The system creates tamper-evident certificates by computing SHA-256 fingerprints of ownership documents in the browser, storing them securely in Supabase, and providing verification capabilities.

## Features

- **Client-Side Cryptography**: SHA-256 hashing performed in the browser using Web Crypto API
- **Secure Storage**: Documents stored in Supabase with PostgreSQL database
- **Official Certificates**: Generate professional-looking certificates with traditional document design
- **PDF Download**: Download certificates as PDF files using jsPDF
- **Document Verification**: Verify document authenticity by comparing fingerprints

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom certificate design colors
- **Database & Storage**: Supabase (PostgreSQL + Storage)
- **Cryptography**: Web Crypto API (browser-native)
- **PDF Generation**: jsPDF
- **Language**: TypeScript

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn package manager
- A Supabase account and project

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project settings under **API**.

### 3. Set Up Supabase Database

The database migration files are located in the `supabase/migrations/` directory.

**Option A: Quick Setup (Recommended)**

Run the migration helper script:

```bash
bash supabase/apply-migration.sh
```

This interactive script will guide you through applying the migration.

**Option B: Manual Setup**

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_create_documents_table.sql`
4. Paste into the SQL Editor and click **Run**

**Option C: Using Supabase CLI**

```bash
supabase link --project-ref your-project-ref
supabase db push
```

For more details, see `supabase/README.md`.

### 4. Set Up Supabase Storage

Create a storage bucket named `documents` in your Supabase project:

**Quick Setup:**

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `documents`
3. Set it to **public** access
4. Apply storage policies using the helper script:
   ```bash
   bash supabase/apply-storage-policies.sh
   ```

**For detailed instructions, see:**
- `supabase/TASK_2.2_INSTRUCTIONS.md` - Complete setup guide
- `supabase/STORAGE.md` - Storage configuration documentation
- `supabase/storage-policies.sql` - SQL policies reference

**Configuration:**
- File size limit: 10MB
- Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
.
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles
│   ├── upload/            # Document upload page
│   ├── certificate/[id]/  # Certificate display page
│   └── verify/[id]/       # Document verification page
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client configuration
│   └── hash.ts           # SHA-256 hash generation
├── components/            # React components
├── public/               # Static assets
└── .env.local           # Environment variables (not in git)
```

## Custom Tailwind Colors

The project includes custom Tailwind colors for certificate design:

- `certificate-cream`: #FFF8E7 - Cream background
- `certificate-off-white`: #FAF7F0 - Off-white background
- `certificate-dark-text`: #1a1a1a - Dark text
- `certificate-deep-blue`: #1e3a5f - Deep blue accent
- `certificate-burgundy`: #6b2737 - Burgundy accent
- `certificate-forest-green`: #2d5016 - Forest green accent
- `certificate-gold`: #d4af37 - Gold decorative
- `certificate-bronze`: #cd7f32 - Bronze decorative

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Lint Code

```bash
npm run lint
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## License

This project is for educational and humanitarian purposes.
